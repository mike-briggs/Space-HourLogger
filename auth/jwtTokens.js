const jwt = require('jsonwebtoken');

const expireTime = '2h'; // expires in one hour

var u = {
    sid: '20009392',
    userLevel: 1
}

generateWebToken = (user) => {
    console.log(user[0]);
    return token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: expireTime
    });
}

module.exports = generateWebToken;//jwt.sign(u, process.env.JWT_SECRET,{});