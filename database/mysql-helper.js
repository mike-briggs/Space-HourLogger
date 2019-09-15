const mysql = require('mysql');
//@TODO Finish card route
//2001:4802:7903:0100:283b:c557:0000:0002 
const config = {
    connectionLimit: 10,
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    multipleStatements: true,
};

const userLevel = {
    general: 2,
    manager: 1,
    admin: 0
};

const userHoursTypes = {
    student:{
        final: 10,
        regular: 18
    },
    guest:{
        final: 6,
        regular: 6
    },
    intern:{
        final: 0,
        regular: 20,
    },
    intern150:{
        final: 0,
        regular: 15
    },
    intern300: {
        final: 0,
        regular: 10
    },
    exempt: {
        final: 0,
        regular: 0
    }
}

const MYSQLTableNames = {
    general: 'users',
    admin: 'admin',
    manager: 'managers'
}

const logTypes = {
    start: 1,
    stop: 0
}

const hourCols = {
    0: 'time_reg',
    1: 'time_final'
}

const millisecondsToHourFactor = 60*60*1000;

// Used to verify that a card swiped has an account
const validationQuery   = 'Select * From users Where stu_no = ?;';

// Create a user query
const createUserQuery   = 'INSERT INTO users SET ?;';

// Admin queries

const changeHoursQuery   = 'Update users Set ?? = ? where stu_no = ?';

// Used for login purposes
const verifyUserQueryBySID      = 'Select * From ?? Where stu_no = ?;';
const verifyUserQueryByEmail    = 'Select * From ?? Where email = ?;';
 
const userStateQuery    = 'Select * from transactions where stu_no = ? and time_stamp = (select max(time_stamp) from transactions where stu_no = ?);';
const stopLogQueryRegular      = 'Update users set time_reg = time_reg + ? where stu_no = ?; Insert Into transactions (stu_no, time_stamp, issuing_stu_no, type, location, final) Values (?,?,?,'+logTypes.stop+',?,?);';
const stopLogQueryFinal        = 'Update users set time_final = time_final + ? where stu_no = ?; Insert Into transactions (stu_no, time_stamp, issuing_stu_no, type, location, final) Values (?,?,?,'+logTypes.stop+',?,?);';
const startLogQuery     = 'Insert Into transactions (stu_no, time_stamp, issuing_stu_no, type, location, final) Values (?,?,?,'+logTypes.start+',?,?); ';

const kickOutQuery    = 'Insert Into transactions (stu_no, time_stamp, issuing_stu_no, type, location) Values ?';
const getActiveQuery  = 'Select * from (Select * from transactions where time_stamp in (select max(time_stamp) from transactions group by stu_no )) As T where T.type = '+ logTypes.start +';';///*'Select * from (*/'Select *, stu_no, max(time_stamp) as time_stamp, type from transactions group by stu_no';//) as T where T.type = '+ logTypes.start +';';

const adminDataQuery    = 'Select stu_no, fname, lname, email, time_reg, req_time_reg, time_final, req_time_final, location From users;'

var pool = mysql.createPool(config);
// Used for processing passport requests with jwt tokens
const findUserBySID = (sid, accessLevel) => {
    var tableName = getTableName(accessLevel);
    if(tableName){
        return findUser(verifyUserQueryBySID, [tableName,sid]);
    }

    return 'Server Error';
}

const findUserByEmail = (email, accessLevel) => {
    var tableName = getTableName(accessLevel);
    if(tableName){
        return findUser(verifyUserQueryByEmail, [tableName,email]);
    }
    else{
        return 'Server Error';
    }
}

// @TODO create general finduser function
function findUser(query, args){
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, query, args))
            .then((rows) => {resolve(extractSingleResult(rows))})
            .catch((err) => {
                logErr(err);
                reject(err);
            });
    });
}

const createUser = (user) => {
    console.log(user);
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, createUserQuery, user))
            .then((rows) => {
                if(rows && rows.affectedRows){
                    resolve(rows);
                }
                else{
                    reject('Account creation failed');
                }
            })
            .catch((err) => {console.log(err);reject('Account Creation Failed, There may be a user with this account already')})
    });
}

const validateCard = (sid) => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, validationQuery, [sid]))
            .then((rows) => {
                if(rows){
                    getState(sid).then((state) => {
                        console.log('state');
                        console.log(state);
                        var singleRow = extractSingleResult(rows);
                        state = extractSingleResult(state);
                        if(state){
                            console.log(state);
                            singleRow.isActive = state.type;
                            if(state.type == logTypes.start){
                                singleRow.hoursWorked = getTimeDifference(state.time_stamp);
                            }
                        }
                        console.log('singleRow');
                        console.log(singleRow);
                        resolve(singleRow);
                    }).catch(err => reject(err));
                }
                else{
                    console.log('resolve');
                    console.log(rows);
                    resolve(rows);
                }
            })
            .catch((err) => {reject(err)});
    });
}


// TODO Complete the query with the inputted values like the time difference 
const startLog = (sid, managerSid, location, final) => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, startLogQuery, [sid, new Date().getTime(),managerSid, location, final]))
            .then((rows) => {
                var result = {};
                if(rows && rows.affectedRows == 1){
                    result.message = sid+' was signed IN successfully';
                    result.error = 0;
                }
                else{
                    result.message = 'Sign in error: no statements executed, please contact IT Manager'
                    result.error = 1;
                }
                resolve(result);

            })
            .catch((err) => {
                logErr(err);
                reject(err);
            });
    });
}

const stopLog = (sid, managerSid, hoursWorked, location, final) => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, final?(stopLogQueryFinal):(stopLogQueryRegular), [hoursWorked, sid, sid, new Date().getTime(), managerSid, location, final]))
            .then((rows) => {
                var result = {};
                if(rows && rows[0] && rows[0].affectedRows == 1){
                    if(rows[1] && rows[1].affectedRows == 1){
                        result.message = sid+' was signed OUT successfully';
                        result.error = 0;
                    }
                    else{
                        result.message = 'Sign out error: only one statement executed, please contact IT Manager'
                        result.error = 1;
                    }
                }
                else{
                    result.message = 'Sign out error: no statements executed, please contact IT Manager'
                    result.error = 1;
                }
                resolve(result);
            })
            .catch((err) => {
                logErr(err);
                reject(err);
            });
    });
}

const getState = (sid) => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, userStateQuery, [sid, sid]))
            .then((rows) => resolve(rows)).catch((err) => {reject(err)});
    });
}

const getAdminData = () => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, adminDataQuery, null))
            .then((rows) => resolve(rows)).catch((err) => {reject(err)});
    });
}

const kickOutActiveLogs = () => {
    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, getActiveQuery, null))
            .then((rows) => {
                if(rows.length > 0){
                    let now = (new Date()).getTime();
                    let data = [];
                    rows.forEach((row) => {
                        data.push([row.stu_no, now, '20009392', logTypes.stop, 'Kickout']);
                    });
                    getConnection()
                        .then((connection) => queryDB(connection, kickOutQuery, [data]))
                        .then((response) => {console.log(response)})
                        .catch((err) => console.log(err));
                }
                else{
                    console.log('no active users volunteering');
                }
            }).catch((err) => {console.log(err)});
    });
}

// TODO remove

const changeHours = (data) => {

    console.log(hourCols[data.hourType]);
    console.log(data.value);
    console.log(data.stu_no);

    return new Promise((resolve, reject) => {
        getConnection()
            .then((connection) => queryDB(connection, changeHoursQuery, [hourCols[data.hourType], data.value, data.stu_no]))
            .then((result) => {resolve(result)})
            .catch((err) => {
                logErr(err);
                reject(err);
            });
    });
}


function getTimeDifference(timeStamp){
    var logTime = new Date(timeStamp);
    var currentTime = (new Date()).getTime();
    // returns the time difference rounded to two decimal places
    return (Math.round(((currentTime - logTime.getTime()) / millisecondsToHourFactor) * 100) / 100);
}

function extractSingleResult(result){
    var output;
    if(result && result[0]){
        output = result[0];
    }
    return output;
}

function queryDB(connection, query, arg){
    return new Promise((resolve, reject) => {
        connection.query(query, arg, (err, rows) => {
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

function getTableName(accessLevel){
    if(accessLevel == userLevel.admin){
        return MYSQLTableNames.admin;
    }
    else if(accessLevel == userLevel.manager){
        return MYSQLTableNames.manager;
    }
    else if(accessLevel == userLevel.general){        
        return MYSQLTableNames.general;
    }
}

const logErr = (err) => {
    console.log(err);
}

module.exports = {
    createUser,
    findUserBySID,
    findUserByEmail,
    validateCard,
    startLog,
    stopLog,
    logTypes,
    userLevel,
    getAdminData,
    changeHours,
    userHoursTypes,
    kickOutActiveLogs
}