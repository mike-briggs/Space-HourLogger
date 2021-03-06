import React, { Component } from 'react';
import { Line, Circle } from 'rc-progress';
import { Switch } from 'react-router';
import Container from 'react-bootstrap/Container';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import CircularProgressbar from 'react-circular-progressbar';
import { Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-circular-progressbar/dist/styles.css';
import engsoclogo from './img/EngSoc-Logo-Black-2.png';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import engsoc from './img/engsoc-s.png';
import englogo from './img/engsoc-b.png';
import DateCountdown from 'react-date-countdown-timer';
import Countdown from './Countdown';
import { Redirect } from 'react-router';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/RingLoader';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import Navbar from './utils/SciNavbar.js';
import axios from 'axios';
//import { library } from '@fortawesome/fontawesome-svg-core';
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';*/
/*import { library } from '@fontawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faIgloo } from '@fontawesome/free-solid-svg-icons';*/

//library.add(faIgloo);
const override = css`
    display: block;
    margin: auto;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-color: #5a058e;
`;

class User extends Component {

  constructor(props) {
    super(props);

    this.state = {
      percent: 30,
      percent2: 25,
      color: '#5a058e',
      color2: '#5a058e',
      redirect: false,
      loaded: false,
      user: null
    };

    this.changeState = this.changeState.bind(this);
    this.redirect = this.redirect.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  changeState() {
    const colorMap = ['#c449ed', '#ba88d8', '#5a058e'];
    const value = Math.floor(Math.random() * 100);
    const value2 = Math.floor(Math.random() * 100);
    const valueString = parseInt(value, 0);
    const valueString2 = parseInt(value2, 0);
    var num = 0;
    var num2 = 0;


    if (value < 33) {
      num = 1;
    }
    else if (33 < value && value < 66) {
      num = 0;
    }
    else if (value > 66) {
      num = 2;
    }
    if (value2 < 33) {
      num2 = 1;
    }
    else if (33 < value2 && value2 < 66) {
      num2 = 0;
    }
    else if (value2 > 66) {
      num2 = 2;
    }
    const colorPicked = colorMap[num];
    const colorPicked2 = colorMap[num2];

    this.setState({
      percent: value,
      color: colorPicked,
      percent2: value2,
      color2: colorPicked2,
    });
  }

  loadData(accept, reject) {
    axios.get('/api/refresh')
      .then((res) => {
        if (res.data && res.data.userLevel === 2) {
          console.log(res.data);
          accept(res);
        }
        else {
          this.setState({ redirect: true });
        }
      }).catch(() => {
        reject();
      });
  }

  redirect() {
    this.setState({ redirect: true });
  }

  componentDidMount() {

    let success = (res) => {
      // runs on success

      console.log(res);
      this.setState({
        user: res.data.user,
        loaded: true
      });
    }

    let failure = () => {
      this.setState({ redirect: true });
    }

    if (!this.props.location.state) {
      this.loadData(success, failure);
    } else {
      console.log(this.props.location.state);
      this.setState({
        user: this.props.location.state.user,
        loaded: true
      });

    }
  }

  render() {

    console.log(this.state);
    const { percent, color, percent2, color2 } = this.state;
    return (
      (this.state.redirect) ? (
        <Redirect push to={{
          pathname: '/',
        }} />
      ) : (
          (this.state.loaded) ? (
            <div className="App">
              <Navbar redirect={this.redirect} />

              <div class="center">
                <h2 class="topSpace">Welcome back {this.state.user.fname} {this.state.user.lname}</h2>
                <div class="cards-list">

                  <div class="card bg-gradient1 1">
                    
                    <div class="card_title title-white">
                      <p>{this.state.user.hoursWorked} / {this.state.user.hoursRequired}</p>
                    </div>
                    <div class="card_title2 title-white">
                      <p>Regular Hours Completed</p>
                    </div>
                  </div>
                  <div className="col-auto center">
                <h1 className="AppTitle " fontWeight="700">Sci Formal is in</h1>
                <Countdown color='#6e6e6e' date={`2019-10-27T00:00:00`} />

              </div>
                  <div class="card bg-gradient1 4">
                    
                    <div class="card_title title-white">
                      <p>{this.state.user.finalHoursWorked} / {this.state.user.finalHoursRequired}</p>
                    </div>
                    <div class="card_title2 title-white">
                      <p>Final Hours Completed</p>
                    </div>
                  </div>

                  

                </div>

              </div>

              <div className="form-row">

              </div>
              
              <Row >
                <Col className="center">
                  <img src={englogo} className="clock" />

                </Col>
              </Row>







            </div>
          )
            : (
              <div>
                <ClipLoader
                  css={override}
                  sizeUnit={"px"}
                  size={150}
                  color={'#123abc'}
                  loading={this.state.loading}
                />
              </div>
            )
        )
    );
  }
}

export default User;
