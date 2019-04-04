import React, { Component } from 'react';
import { Line, Circle } from 'rc-progress';
import { Switch } from 'react-router';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import CircularProgressbar from 'react-circular-progressbar';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-circular-progressbar/dist/styles.css';
import engsoclogo from './img/EngSoc-Logo-Black-2.png';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import engsoc from './img/engsoc-s.png';
import clock from './img/engsoc-b.png';
import DateCountdown from 'react-date-countdown-timer';
import Countdown from './Countdown';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
//import { library } from '@fortawesome/fontawesome-svg-core';
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';*/
/*import { library } from '@fontawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faIgloo } from '@fontawesome/free-solid-svg-icons';*/

//library.add(faIgloo);

class User extends Component {

  constructor() {
    super();
    this.state = {
      percent: 30,
      percent2: 25,
      color: '#5a058e',
      color2: '#5a058e',
    };
    this.changeState = this.changeState.bind(this);
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

  render() {
    const { percent, color, percent2, color2 } = this.state;


    return (

      <div className="App">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home"><img src={engsoclogo} className="nav-logo" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Link to="/" className="Nav-text">Logout</Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>


        <Container className="center">
          <Row>
            <Col>
              <h1 className="AppTitle" fontWeight="700">Sci Formal is</h1>
              <Countdown color = '#6e6e6e' date={`2019-09-18T00:00:00`} />
              <h2>away from now</h2>
            </Col>
          </Row>
          
          <Col>
            <Row>
              <Col className="center">
                <div className="AppTitle" padding="30px">Hours Completed </div>


                <div className="center">
                  <CircularProgressbar
                    className="circleContainerStyle"
                    percentage={percent}
                    text={`${percent}%`}
                    styles={{
                      path: { stroke: `rgba(90, 5, 142, ${percent / 50})` },
                      text: { fill: '#5a058e', fontSize: '16px', fontWeight: '800' },
                    }}
                  />
                </div>

              </Col>
              <Col className="center">
                <div className="AppTitle" padding="30px">Avg Completed</div>

                <div className="center">
                  <CircularProgressbar
                    className="circleContainerStyle"
                    percentage={percent2}
                    text={`${percent2}%`}
                    styles={{
                      path: { stroke: `rgba(90, 5, 142, ${percent2 / 50})` },
                      text: { fill: '#5a058e', fontSize: '16px', fontWeight: '800' },
                    }}
                  />
                </div>

              </Col>
            </Row>
          </Col>



          <Row>
            <Col>
              <button className="FormField__Button" onClick={this.changeState}> Change Percentage</button>

            </Col>
          </Row>
          <Row>
            <Col>
              <img src={clock} className="clock" />

            </Col>
          </Row>



        </Container>

      </div>
    );
  }
}

export default User;
