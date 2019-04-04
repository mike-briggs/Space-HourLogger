// template code
import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './Login.js';
import Manager from './Manager.js';
import { Switch } from 'react-router';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
//import { library } from '@fortawesome/fontawesome-svg-core';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import Admin from './Admin';
import User from './User';

import './App.css';
class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="" component={SignInForm}>
          </Route>
          <Route path="/sign-up" component={SignUpForm}>
          </Route>
          <Route path="/manager" component={Manager}>
          </Route>
          <Route path="/user" component={User}>
          </Route>
          <Route path="/admin" component={Admin}>
          </Route>

        </div>


      </Router>


    );
  }
}
export default App;