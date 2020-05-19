import auth0 from 'auth0-js';

export default class Auth {
    constructor(history) {
        this.history = history;
        this.auth0 = new auth0.WebAuth({
            domain: 'mpa-dev.auth0.com',
            clientID: 'ZKMkLQwP8RHi85wCSBQfqWfCUWq96DtT',
            //redirectUri: 'http://localhost:3000/callback',
            redirectUri: 'https://mollypanderson.github.io/callback',
            responseType: "token id_token",  // token: access token to make api calls, id_token: jwt token to authenticate user
            scope: "openid profile email" // openid: we'll get back standard openid claims like issuer, audience, expiration, etc, profile: get back user data from whatever
                                    // site, like from Google it would be picture, name, etc
        });
    }

    login = () => {
        this.auth0.authorize(); // available from the auth0.WebAuth object. redirects browser to Auth0 login page
    };

    handleAuthentication = () => {
        // parse out data and write it to our session
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                // create a session and store data
                this.setSession(authResult);
                this.history.push("/"); // tell react router you want to redirect to a new url (homepage)

            } else if (err) {
                this.history.push("/");
                alert(`Error: ${err.error}. Check the console for further details.`);
                console.log(err);
            }
        });
    };

    setSession = authResult => {
        // set time that the access token will expire
        const expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );

        localStorage.setItem("access_token", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("expires_at", expiresAt);

    };

    isAuthenticated() {
        const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return new Date().getTime() < expiresAt;    // returns false if token has expired. this is for our own convenience - the api really
                                                    // controls if you're truly validated or not and will expire you when the time comes
    }

    logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        this.userProfile = null;
        this.auth0.logout({
            clientID: 'ZKMkLQwP8RHi85wCSBQfqWfCUWq96DtT',
            //returnTo: "http://localhost:3000"
            returnTo: "https://mollypanderson.github.io/"
        });
    };

    getAccessToken = () => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
            throw new Error("No access token found.");
        }
        return accessToken;
    };

    getProfile = cb => {
        if (this.userProfile) return cb(this.userProfile);
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            cb(profile, err);
        });
    };

}