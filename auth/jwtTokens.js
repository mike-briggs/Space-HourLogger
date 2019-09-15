const jwt = require('jsonwebtoken');

const expireTime = '2h'; // expires in two hour

generateWebToken = (user) => {
    console.log('token generated: ');
    console.log(user);
    return token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: expireTime
    });
}

module.exports = generateWebToken;//jwt.sign(u, process.env.JWT_SECRET,{});