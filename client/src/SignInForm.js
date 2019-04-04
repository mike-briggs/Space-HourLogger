import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import engsoc from './img/engsoc-s.png';
import user from './img/user2.png';
import space from './img/space_login.png';
import { Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';

var loggedIn = false;
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';*/
/*import { library } from '@fontawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faIgloo } from '@fontawesome/free-solid-svg-icons';*/

//library.add(faIgloo);

class SignInForm extends Component {

    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            loggedIn: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const data = {
            email: this.state.email,
            password: this.state.password

        }

        axios.post('./api/login', data)
            .then(res => {
                console.log(res);
                loggedIn = true;
            })
    }

    

    render() {
        return (
            loggedIn ? (
                <Redirect to="/user" />
            ) : (
                <Row>
          <Col><img src={space} className="space"></img></Col>
            <Col>
              

              <div className="FormCenter">
                <form onSubmit={this.handleSubmit} className="FormFields">
                <i class="fas fa-7x fa-user-astronaut astro"></i>
                  <h1 className="AppTitle">Welcome Back</h1>
                  
                  
                  <div class="input input--kohana">
                    <input class="input__field input__field--kohana" type="text" id="input-3" />
                    <label class="input__label input__label--kohana" for="input-3">
                      <i class="fas fa-fw fa-crown icon-c icon--kohana"></i>
                      <span class="input__label-content input__label-content--kohana"><i class="fas fa-crown icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Student Number</span>
                    </label>
                  </div>
                  <br/>
                  <div class="input input--kohana">
                    <input class="input__field input__field--kohana" type="text" id="input-4" />
                    <label class="input__label input__label--kohana" for="input-4">
                      <i class="fa fa-fw fa-lock icon icon--kohana"></i>
                      <span class="input__label-content input__label-content--kohana"><i class="fa fa-lock icon-before"></i>&nbsp;&nbsp;&nbsp;&nbsp;Password</span>
                    </label>
                  </div>
                  <br/>
                  


                  <div className="FormField">
                    <Link to="/sign-up" className="FormField__Link">Create Account</Link>
                  </div>
                  <div className="FormField">
                    <Link to="/admin" className="FormField__Link">Admin</Link>
                  </div>
                  <div className="FormField">
                    <Link to="/user" className="FormField__Link">User</Link>
                  </div>
                  <div className="FormField">
                    <Link to="/manager" className="FormField__Link">Manager</Link>
                  </div>
                  <br />
                  <div className="FormField">
                    <button type="submit" className="FormField__Button"  onClick={this.handleSubmit}>Sign Up</button>
                  </div>

                </form>
              </div>
            </Col>
            
			
          </Row>
                    
                )


        );
    }
}

export default SignInForm;