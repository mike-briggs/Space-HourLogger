var mysql = require('mysql');

var db = require('../database/mysql-helper.js');
var bcrypt = require('../auth/bcrypt-helper.js');
const generateToken = require('../auth/jwtTokens.js');

var connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USERNAME,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});

let verifyStr = (str) => {
  return (str != '' && (typeof str === 'string'));
}

let verifyWord = (str) => { 
  return (str != '' && (typeof str === 'string') && str.match(/^[A-Za-z]+$/));
}

let verifyEmail = (email) => {
  return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
}

let verifyStudentNum = (num) => {
  return num.length === 8 && /^\d\d\d\d\d\d\d\d$/.test(num);
}

let verifyPassword = (pass) => {
  return /.........*/.test(pass);
}

let formatName = (name) => {
  name = name.trim();
  return name.charAt(0).toUpperCase() + name.substring(1);
}

const register = function(req,res){

  var body = req.body;
  if(body && body.userType){
    var userType = db.userHoursTypes[body.userType];

    if(verifyPassword(body.pswd) && verifyWord(body.fname) && verifyWord(body.lname) && verifyStudentNum(body.stu_no) && verifyEmail(body.email) && verifyStr(body.location) && userType){
      
      var user = {
        fname:    formatName(body.fname),
        lname:    formatName(body.lname),
        stu_no:   body.stu_no,
        email:    body.email,
        pswd:     bcrypt.hash(body.pswd),
        time_reg: 0,
        req_time_reg: userType.regular,
        time_final: 0,
        req_time_final: userType.final,
        location: body.location
      }
    
      db.createUser(user)
        .then((result) => {
          sendUserData(res, user);
        })
        .catch((err) => {
          console.log(err);
          sendError(res, 'Account with that student number or email already exists.');
      });
    }
    else{
      console.log(verifyWord(body.fname));
console.log(verifyWord(body.lname));
console.log(verifyStudentNum(body.stu_no));
console.log(verifyEmail(body.email));
console.log(verifyStr(body.location));
console.log(userType);
      sendError(res, 'bad data');
    }
  }
  else{
    sendError(res, 'Hour types not defined');
  }
}

const logout = function(req, res){
  res.cookie('jwt','');
  res.send({
    success: true
  });
}

//  Needs user level in body
/**
 *  body = {
 *    email,
 *    password,
 *    userLevel
 *  }
 */
const login = function(req,res){
  //var userLevel = req.body.userLevel;
  var email = req.body.email;
  var password = req.body.password;
  var userLevel = req.body.userLevel;
  if(typeof userLevel != 'undefined' && email && password){
    db.findUserByEmail(email, userLevel)
      .then((result) => {
        if(bcrypt.compare(password, result.pswd)){

          if(userLevel == db.userLevel.admin){
            db.getAdminData().then((adminData) => {
              sendAdminData(res, result, adminData, {success: 'Login succesfull'});
            }).catch((err) => {
              sendAdminData(res, result, err, {failed: 'Login succesfull, admin data error. Contact support'});
            });
          }
          else if(userLevel == db.userLevel.general){
            sendUserData(res, result);
          }
          else if(userLevel == db.userLevel.manager){
            sendManagerData(res, result);
          }
          else{
            sendError(res, 'Something wrong with front end');
          }
        }
        else{
          sendError(res, 'Incorrect Login Provided');
        }
      })
      .catch((err) => {
        sendError(res, 'error ocurred');
      });
  }
  else{
    sendError(res, 'insufficient information');
  }
}


/**
 * user = {level, email}
 */
const refresh = (req, res) => {
  var userLevel = req.user.level;
  if(userLevel == db.userLevel.general){
    db.findUserByEmail(req.user.email, userLevel)
    .then((result) => {
      sendUserData(res, result);
    })
    .catch((err) => {
      sendError(res, err);
    });
  }
  else if(userLevel == db.userLevel.manager){
    db.findUserByEmail(req.user.email, userLevel).then((result) => {
      sendManagerData(res, result);
    })
    .catch((err) => {
      sendError(res, err);
    });
  }
  else if(userLevel == db.userLevel.admin){
    db.findUserByEmail(req.user.email, userLevel).then((result) => {
      db.getAdminData().then((adminData) => {
        sendAdminData(res, result, adminData, {success: 'Login succesfull'});
      }).catch((err) => {
        console.log(err);
        sendAdminData(res, result, adminData, {failed: 'Login succesfull, admin data error. Contact support'});
      });
    })
    .catch((err) => {
      sendError(res, err);
    });
  }
  else{
    console.log('Sending User data');
  }
}

function sendUserData(res, result){
  var tokenUser = {
    email: result.email,
    level: db.userLevel.general
  }

  res.cookie('jwt',generateToken(tokenUser), {httpOnly: true});
  res.status(200);

  res.send({
    success:'login sucessfull',
    user:{
      fname: result.fname,
      lname: result.lname,
      email: result.email,
      hoursWorked: result.time_reg,
      hoursRequired: result.req_time_reg,
      finalHoursWorked: result.time_final,
      finalHoursRequired: result.req_time_final,
    },
    userLevel: db.userLevel.general
  });
}

function sendManagerData(res, result){
  var tokenUser = {
    email: result.email,
    level: db.userLevel.manager
  }

  res.cookie('jwt',generateToken(tokenUser), {httpOnly: true});
  res.status(200);

  res.send({
    success:'login sucessfull',
    user:{
      fname: result.fname,
      lname: result.lname,
      email: result.email,
    },
    userLevel: db.userLevel.manager
  });
}

function sendAdminData(res, result, data, message){
  var tokenUser = {
    email: result.email,
    level: db.userLevel.admin
  }

  res.cookie('jwt',generateToken(tokenUser), {httpOnly: true});
  res.status((message.success ? 200: 400));
  if(message){
    res.send({
      data: data,
      ...message,
      user:{
        fname: result.fname,
        lname: result.lname,
        email: result.email
      },
      userLevel: db.userLevel.admin
    });
  }
  else{
    res.send({
      data: adminData,
      user:{
        fname: result.fname,
        lname: result.lname,
        email: result.email
      },
      userLevel: db.userLevel.admin
    });
  }
}

function sendError(res, message){
  res.status(400);
  res.send({code:400, failed: message});
}

module.exports = {
  login: login,
  register: register,
  refresh: refresh,
  logout: logout
}
  
