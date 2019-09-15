// get database functions
const db = require('../database/mysql-helper.js');
const generateToken = require('../auth/jwtTokens.js');

// @TODO: complete database interaction

/**
 * body = {
 *      user (stu no),
 *      final (1 or 0)
 * }
 * 
 * returns {}
 */
exports.manageLog = (req,res) => {
    if(req.body && req.body.user){
        let number = req.body.user.trim();
        let final = req.body.final;
        let location = req.body.location;
        if(/^\d\d\d\d\d\d\d\d$/.test(number) && typeof final !== 'undefined'  && location){
            let tokenUser = {
                email: req.user.email,
                level: db.userLevel.manager
            }
            db.validateCard(number).catch(err => console.log(err))
                .then((userData) => {
                    console.log(userData);
                    if(userData){
                        userData.final = final;
                        userData.location = location;
                        toggleLog(userData, req.user)
                        .then((result) => {
                            res.cookie('jwt',generateToken(tokenUser), {httpOnly: true});
                            res.send({
                                message: result.message,
                                error: result.error
                            });
                        });
                    }
                    else{
                        res.cookie('jwt',generateToken(tokenUser), {httpOnly: true});
                        res.send({
                            message: 'User Not Found',
                            error: 1
                        });
                    }   
                })
                .catch((err) => {
                    res.cookie('jwt',generateToken(tokenUser), {httpOnly: true});
                    res.send({
                        message: err,
                        error: 1
                    });
                });
        }
        else{
            res.send({
                error: 1,
                message: 'invalid input, contact it if using the web app'
            });
        }
    }
}

function toggleLog(userData, manager){
    return new Promise((resolve, reject) => {
        if(userData.isActive == db.logTypes.start){
            db.stopLog(userData.stu_no, manager.stu_no, userData.hoursWorked, userData.location, userData.final)
                .then((message) => resolve(message))
                .catch((err) => reject(err));
        }
        else{
            db.startLog(userData.stu_no, manager.stu_no, userData.location, userData.final)
                .then((message) => resolve(message))
                .catch((err) => reject(err));
        }
    });
}
