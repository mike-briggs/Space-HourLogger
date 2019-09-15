var db = require('../database/mysql-helper.js');
const generateToken = require('../auth/jwtTokens.js');

/**
 * 
 * body = {
 *      stu_no (student number),
 *      hourType (general or final),
 *      value (the hour that you want to set)
 * }
 */
const changeHours = (req, res) => {
    console.log('req user');
    console.log(req.user);
    console.log(req.body);
    if(req.user.level === 0){
        if(req.body.stu_no && typeof req.body.hourType != 'undefined' && req.body.value){
            let tokenUser = {
                email: req.user.email,
                level: req.user.level
            }

            res.cookie('jwt', generateToken(tokenUser), {httpOnly: true});
            db.changeHours(req.body).then((result) => {
                if(result.affectedRows === 1){
                    res.status(200);
                    res.send({
                        success: 1
                    });
                }
                else if(result.affectedRows > 1){
                    res.status(400);
                    res.send({
                        success: 1,
                        error: 'More than one row affected'
                    });
                }
                else{
                    res.status(400);
                    res.send({
                        error: 'No rows effected'
                    });
                }
            }).catch((err) => {
                res.status(400);
                res.send({
                    error: err
                });
            });
        }
        else{
            res.send({
                error: 'bad body'
            });
        }
    }
    else{
        res.send({
            error: 'unauthorized'
        });
    }
}

module.exports = {
    changeHours
}