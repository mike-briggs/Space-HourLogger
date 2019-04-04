const ppt = require('passport-jwt');
const db = require('../database/mysql-helper.js');

var JwtStrategy = ppt.Strategy;
var ExtractJWT  = ppt.ExtractJwt;

var jwtStrategy = (passport) => {
    const opts = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };
    passport.use(new JwtStrategy(opts, (payload, done) => {
        if(typeof payload.sid != 'undefined' && typeof payload.userLevel != 'undefined'){
            db.findUser(payload.sid, payload.userLevel)
            .then((user) => {
                if(user){
                    return done(null, user);
                }
                else{
                    return done(null, false);
                }
            }).catch((err) => {
                return done(err,false);
            });
        }
        else{
            return done('No id or userlevel', false);
        }
    }));
}

module.exports = jwtStrategy;