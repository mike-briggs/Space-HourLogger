import React, { Component } from 'react';
import { Line, Circle } from 'rc-progress';
import { Switch } from 'react-router';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import CircularProgressbar from 'react-circular-progressbar';
import { Navbar, Form, FormControl, Button, Table, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import engsoclogo from './img/EngSoc-Logo-Black-2.png';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import engsoc from './img/engsoc-s.png';
import add from './img/add.png';
import remove from './img/remove.png';
import user from './img/user2.png';
import Popup from "reactjs-popup";
import axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import Axios from 'axios';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
const { SearchBar } = Search;
//import { library } from '@fortawesome/fontawesome-svg-core';
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';*/
/*import { library } from '@fontawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faIgloo } from '@fontawesome/free-solid-svg-icons';*/

//library.add(faIgloo);

class Admin extends Component {


  constructor(props, context) {
    super(props, context);

    this.handleShowAdd = this.handleShowAdd.bind(this);
    this.handleCloseAdd = this.handleCloseAdd.bind(this);
    this.handleShowMinus = this.handleShowMinus.bind(this);
    this.handleCloseMinus = this.handleCloseMinus.bind(this);

    this.state = {
      show: false,
      show2: false,
      row: [],
      users: []

    };


  }

  handleCloseAdd() {

    this.setState({ show: false });

  }

  handleShowAdd() {

    this.setState({ show: true });

  }

  handleCloseMinus() {
    this.setState({ show2: false });
  }
  handleShowMinus() {
    this.setState({ show2: true });
  }
  handleSubmit() {

  }

  componentDidMount() {
    axios.get("./api/hello")

      .then(res => {

        this.setState({ users: res.data })
      });

  }

  render() {
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        
          this.setState({row: rowIndex});
        
      }
    };
    const add_delete = (cell,row) => {
      return (
        <div className="center">
          <div ><i class="fas fa-pencil-alt icon"onClick = {this.handleShowAdd}></i>{cell}</div>
        </div>
      )
    }
    const products = [{ "id": 2, "name": "screen", "price": "$22" }];
    const columns = [{
      dataField: 'email',
      text: 'Email'
    }, {
      dataField: 'stu_no',
      text: '#'
    }, {
      dataField: 'tot_time',
      text: 'Hours Completed'
    }, {
      dataField: 'req_time',
      text: 'Hours Required',
    },{
      dataField: 'modify',
      text: 'Modify',
      formatter: add_delete,
      editable: false 
    }];
    return (


      <div className="App">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/"><img src={engsoclogo} className="nav-logo" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Link to="/" className="Nav-text">Logout</Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal show={this.state.show} onHide={this.handleCloseAdd} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Hours</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="FormField">
              <input type="text" id="hours" className="FormField__Input" placeholder="# Of Hours" name="hours" value={this.state.hours} onChange={this.handleChange} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseAdd}>
              Close
            </Button>
            <Button variant="success" onClick={this.handleCloseAdd}>
              Add Hours
            </Button>
            <Button variant="danger" onClick={this.handleCloseAdd}>
              Remove Hours
            </Button>
          </Modal.Footer>
        </Modal>           

       
          <Row>
            <Col lg={4}>
              <div className="AppTitle" padding="30px">Hours Completed {this.state.row}</div>
              <div className="center" padding="30px">
                <CircularProgressbar
                  className="circleContainerStyle"
                  percentage='30'
                  text='30%'
                  styles={{

                    path: { stroke: '#5a058e' },
                    text: { fill: '#5a058e', fontSize: '16px', fontWeight: '800' },
                  }}
                />

              </div>
            </Col>
            <Col lg={7}>
            
              <ToolkitProvider
                keyField="id"
                data={this.state.users}
                columns={columns}
                search
              >
                {
                  props => (
                    <div>

                      <div class="input input--kohana">

                        <SearchBar className="input__field input__field--search Search-Bar" placeholder=" " {...props.searchProps} id="input-23" />
                        <label class="input__label input__label--search" for="input-23">
                          <i class="fa fa-fw fa-search icon icon--search"></i>
                          <span class="input__label-content input__label-content--search"><i class="fa fa-search"></i>&nbsp;&nbsp;&nbsp;&nbsp;Search</span>
                        </label>
                      </div>

                      
                      <BootstrapTable className="table-dark"pagination={paginationFactory()} rowEvents={ rowEvents }
                        {...props.baseProps}  hover  filter={ filterFactory() }
                      />
                    </div>
                  )
                }
              </ToolkitProvider>
            </Col>


          </Row>

        


      </div>
    );
  }
}

export default Admin;
