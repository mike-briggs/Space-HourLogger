import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import space from './img/space_login.png';
import user from './img/user2.png';
import { Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';
var utils = require('./utils/validate');

class SignUpForm extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      pswd: '',
      name: '',
      stu_no: ''

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
    const split = this.state.name.split(" ", 2);
    const first = split[0];
    const second = split[1];

    const data = {
      email: "sjlgfh@queensu.ca",
      pswd: "test",

      stu_no: 2384
    }

    axios.post('./api/register', data)
      .then(res => {
        console.log(res);
      })
  }



  render() {
    //const errors = utils.validate(this.state.email, this.state.password);
    //const isEnabled = !Object.keys(errors).some(x => errors[x]);
    return (






      <Row>
        <Col><img src={space} className="space"></img></Col>
        <Col>
          
            
            
            <div className="FormCenter">
            <i class="fas fa-5x fa-user-astronaught icon icon--kohana"></i>
            
              <form onSubmit={this.handleSubmit} className="FormFields">
              <i class="fas fa-7x fa-user-astronaut astro"></i>
                <h1 className="AppTitle">Create Account</h1>
                <div class="input input--kohana">
                  <input class="input__field input__field--kohana" type="text" id="fname" />
                  <label class="input__label input__label--kohana" for="input-1">
                    <i class="fa fa-fw fa-user icon icon--kohana"></i>
                    <span class="input__label-content input__label-content--kohana"><i class="fa fa-user"></i>&nbsp;&nbsp;&nbsp;&nbsp;Full Name</span>
                  </label>
                </div>
                <br />
                <div class="input input--kohana">
                  <input class="input__field input__field--kohana" type="text" id="email" name="email" />
                  <label class="input__label input__label--kohana" for="input-2">
                    <i class="fas fa-fw fa-paper-plane icon icon--kohana"></i>
                    <span class="input__label-content input__label-content--kohana"><i class="fas fa-paper-plane"></i>&nbsp;&nbsp;&nbsp;&nbsp;Email</span>
                  </label>
                </div>
                <br />
                <div class="input input--kohana">
                  <input class="input__field input__field--kohana" type="text" id="stu_no" name="stu_no" />
                  <label class="input__label input__label--kohana" for="input-3">
                    <i class="fas fa-fw fa-crown icon-c icon--kohana"></i>
                    <span class="input__label-content input__label-content--kohana"><i class="fas fa-crown"></i>&nbsp;&nbsp;&nbsp;&nbsp;Student Number</span>
                  </label>
                </div>
                <br />
                <div class="input input--kohana">
                  <input class="input__field input__field--kohana" type="text" id="pswd" name="pswd" />
                  <label class="input__label input__label--kohana" for="input-4">
                    <i class="fa fa-fw fa-lock icon icon--kohana"></i>
                    <span class="input__label-content input__label-content--kohana"><i class="fa fa-lock"></i>&nbsp;&nbsp;&nbsp;&nbsp;Password</span>
                  </label>
                </div>
                <br />
                <div class="input input--kohana">
                  <input class="input__field input__field--kohana" type="text" id="cpswd" />
                  <label class="input__label input__label--kohana" for="input-5">
                    <i class="fa fa-fw fa-lock icon icon--kohana"></i>
                    <span class="input__label-content input__label-content--kohana"><i class="fa fa-lock"></i>&nbsp;&nbsp;&nbsp;&nbsp;Confirm Password</span>
                  </label>
                </div>


                <div className="FormField">
                  <Link to="/" className="FormField__Link">I'm already a member</Link>
                </div>
                <br />
                <div className="FormField">
                  <button type="submit" className="FormField__Button" onClick={this.handleSubmit}>Sign Up</button>
                </div>

              </form>
            </div>
          

        </Col>
      

        </Row>






    );
  }
}

export default SignUpForm;
