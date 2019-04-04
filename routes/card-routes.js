// get database functions
// temp database simulator
const db = require('../database/mysql-helper.js');
const generateToken = require('../auth/jwtTokens.js');
// const db = {
//     verifyUser: sid => {
//         return true;
//     },
//     startLog: (sid, callBack) => {

//     },
//     stopLog: (sid, callBack) => {

//     }
// }

// @TODO: complete database interaction
exports.manageLog = (req,res) => {
    console.log(req.user);
    db.validateCard(req.body.number).catch(err => console.log(err))
        .then((userData) => {
            if(userData){
                toggleLog(userData)
                .then((message) => res.send({
                    token: generateToken(req.user),
                    message: message
                }));
            }
            else{
                res.send({
                    token: generateToken(req.user),
                    message: 'User Not Found, Please Create an Account'
                });
            }   
        })
        .catch((err) => res.send({
            token: generateToken(req.user),
            message: err
        }));
}

function toggleLog(rowsData){
    console.log(rowData);
    var userData = rowsData[0];
    return new Promise((resolve, reject) => {
        if(userData.isActive){
            db.stopLog(userData.stu_id)
                .then((message) => resolve(message))
                .catch((err) => reject(err));
        }
        else{
            db.startLog(userData.stu_id)
                .then((message) => resolve(message))
                .catch((err) => reject(err));
        }
    });
}
