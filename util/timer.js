var db = require('../database/mysql-helper.js');

var start = () => {
    var now = new Date();
    var millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0, 0) - now;
    millisTill12 += (millisTill12>0) ? 0:86400000; // add a day if the time is after 12
    setTimeout(() => midnightAction(db), millisTill12);
}

function midnightAction(db){
    console.log('midnight timer activated');
    db.kickOutActiveLogs();
    setTimeout(() => midnightAction(db), 86400000);
}

module.exports = {
    start
}