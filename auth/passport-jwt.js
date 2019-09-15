const ppt = require('passport-jwt');
const db = require('../database/mysql-helper.js');

var JwtStrategy = ppt.Strategy;

var jwtStrategy = (passport) => {
    const opts = {
        jwtFromRequest: extractJWTFromCookie,
        secretOrKey: process.env.JWT_SECRET
    };
    passport.use(new JwtStrategy(opts, (payload, done) => {
        if(typeof payload.level !== 'undefined'){
            if(typeof payload.email !== 'undefined'){
                db.findUserByEmail(payload.email, payload.level)
                .then((user) => {
                    if(user){
                        user.level = payload.level;
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
                return done('No email', false);
            }
        }
        else{
            return done('No userlevel', false);
        }
    }));
}

var extractJWTFromCookie = function (req){
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
}

module.exports = jwtStrategy;