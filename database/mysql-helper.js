const mysql = require('mysql');

const config = {
    connectionLimit: 10,
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
};

const userLevel = {
    general: 2,
    manager: 1,
    admin: 0
};

const MYSQLTableNames = {
    general: 'users',
    admin: 'admins',
    manager: 'managers'
}

const logTypes = {
    start: 0,
    stop: 1
}

const validationQuery   = 'Select * From users Where stu_no = ?';
const startLogQuery     = 'Select stu_no From users Where stu_no = ?';
//const userStateQuery    = 'Select * From transactions Join (Select stu_no, MAX(time_stamp) AS mostRecentLog FROM users Where sid = ?) ms ON tbl.id = ms.id AND signin = maxsign WHERE tbl.id=1';

// Used for login purposes
const verifyUserQuery   = 'Select * From ?? Where stu_no = ?';

var pool = mysql.createPool(config);

var validateCard = (sid) => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, validationQuery, [sid]))
            .then((rows) => resolve(rows)).catch((err) => {reject(err)});
    });
}

// TODO modify to start the log
var startLog = (sid) => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, startLogQuery, [sid]))
            .then((rows) => resolve(rows))
            .catch((err) => {
                logErr(err);
                reject(err);
            });
    });
}

var stopLog = (sid) => {

}

// Used for processing passport requests with jwt tokens
var findUser = (sid, accessLevel) => {
    console.log(sid+', '+ accessLevel);
    var tableName;
    if(accessLevel == userLevel.admin){
        tableName = MYSQLTableNames.admin;
    }
    else if(accessLevel == userLevel.manager){
        tableName = MYSQLTableNames.manager;
    }
    else if(accessLevel == userLevel.general){        
        tableName = MYSQLTableNames.general;
    }
    return new Promise((resolve, reject) => {
        if(tableName){
            getConnection()
                .then((connection) => queryDB(connection, verifyUserQuery, [tableName,sid]))
                .then((rows) => resolve(rows))
                .catch((err) => {
                    logErr(err);
                    reject(err);
                });
        }
        else{
            reject('Access Level Not Recognized');
        }
    });
}

function queryDB(connection, validationQuery, arg){
    return new Promise((resolve, reject) => {
        var output = connection.query(validationQuery, arg, (err, rows) => {
            if(err) reject(err);
            connection.release();
            if(rows){
                resolve(JSON.parse(JSON.stringify(rows)));
            }
        });
    });
}

function getConnection(){
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            resolve(connection);
        });
    });
}

const logErr = (err) => {
    console.log(err);
}

module.exports = {
    findUser,
    validateCard,
    startLog,
    stopLog,
}