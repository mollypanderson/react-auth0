import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Auth from './Auth/Auth';
import Callback from './Callback';

class App extends Component {

    constructor(props) {
        super(props);
        this.auth = new Auth(this.props.history);
    }

    render() {
        return (
            <React.Fragment>
                <Nav auth={this.auth}/>
                <div className="body">
                    <Route
                        path="/react-auth0"
                        exact
                        render={props => <Home auth={this.auth} {...props} />}
                    />
                    <Route
                        path="/react-auth0/callback"
                        render={props => <Callback auth={this.auth} {...props} />}
                    />
                    <Route path="/react-auth0/profile"
                           render={props =>
                               this.auth.isAuthenticated() ? (
                                   <Profile auth={this.auth} {...props} />
                               ) : (
                                   <Redirect to="/react-auth0" />
                               )
                           }
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default App;
