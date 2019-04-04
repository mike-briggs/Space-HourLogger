import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './img/gear.png';
import Nav from 'react-bootstrap/Nav';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';
import engsoclogo from './img/EngSoc-Logo-Black-2.png';
import Jumbotron from 'react-bootstrap/Jumbotron';
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';*/
/*import { library } from '@fontawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faIgloo } from '@fontawesome/free-solid-svg-icons';*/
import './App.css';
//library.add(faIgloo);

class Manager extends Component {
  state = {
    response: '',
    responseToPost: '',
    cardError:false,
    cardInput: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();
    var regex = new RegExp('\\d\\d\\d\\d\\d\\d\\d\\d','');
    var studentNumber = this.state.cardInput.match(regex);
    if(studentNumber){
        this.setState({
          cardError:false
        });
        this.logNumber(studentNumber[0]);
    }else{
        this.setState({
          cardError:true,
          responseToPost: null
        });
    }
    this.setState({cardInput:'',submit:true});
  };

  logNumber = async studentNum => {

    const response = await fetch('/api/log-number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });

    const body = await response.text();

    if(body){
      this.setState({responseToPost: body});
    }
  }

  displayMessage = () => {
    if(this.state.cardError){
      return(
        <div className='error-message'>
          <p>Please swipe card again</p>
        </div>
        )
    } 
    else if(this.state.responseToPost){
      return(
      <div className={this.state.responseToPost.error ? 'error-message':'success-message'}>
        <p>
          {this.state.responseToPost.message}
        </p>
      </div>
      )
    }
    else{
      return ;
    }
  }

  render() {
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Swipe Student Card to Start/Stop Tracking Hours
          </p>
          
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Click in the input field then swipe card:</strong>
          </p>
          <input
            type="text"
            value={this.state.cardInput}
            onChange={e => this.setState({ cardInput: e.target.value })}
          />
        </form>
        {this.displayMessage()}
        

      </div>
    );
  }
}

export default Manager;
