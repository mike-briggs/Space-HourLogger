// template code
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;//process.env.PORT || 5000;
const passport = require('passport');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var router = express.Router();
var login = require('./routes/loginroutes');
var card = require('./routes/card-routes');

var jwtToken = require('./auth/jwtTokens.js');

var mysql = require('mysql');

passport.initialize();

require('./auth/passport-jwt.js')(passport);

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );

  con.connect(function(err) {
    if (err) throw err;
  con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });

});

});

router.post('/register',login.register);
router.post('/login',login.login);
router.get('/hello',login.hello);
router.post('/log-number',passport.authenticate('jwt', {session: false}), card.manageLog);
router.post('/get-key',function(req,res){
  res.send({
    key: jwtToken
  });
});
app.use('/api', router);
  

app.listen(port, () => console.log(`Listening on port ${port}`));