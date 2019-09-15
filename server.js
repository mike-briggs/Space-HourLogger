const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
const passport = require('passport');
const path = require('path');

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var router = express.Router();
var login = require('./routes/loginroutes');
var card = require('./routes/card-routes');
var admin = require('./routes/admin-routes');

passport.initialize();

require('./auth/passport-jwt.js')(passport);

require('./util/timer.js').start();

router.post('/register',login.register);
router.post('/login',login.login);
router.get('/logout', login.logout);
router.post('/log-number', passport.authenticate('jwt', {session: false}), card.manageLog);
router.get('/refresh', passport.authenticate('jwt', {session: false}), login.refresh);
router.post('/change-hours', passport.authenticate('jwt', {session: false}), admin.changeHours);

app.use('/api', router);
  
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));