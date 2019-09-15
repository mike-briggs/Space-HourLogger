var bcrypt = require('bcrypt');

const saltRounds = 10;

var hash = (pswd) => {
    console.log(typeof pswd);
    return bcrypt.hashSync(pswd, genSalt());
}

var compare = (pswd, hash) => {
    return bcrypt.compareSync(pswd,hash);
}

var genSalt = () => {
    return bcrypt.genSaltSync(saltRounds);
}

module.exports = {
    hash,
    compare
}