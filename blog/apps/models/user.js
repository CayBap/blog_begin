var q = require("q");//promise
var db = require("../common/database");
var conn = db.getConection();

function addUser(user) {
    if(user){
        var defer = q.defer();
        var query = conn.query('Insert into user SET ?',user,function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}
function getUserByEmail(email){
    if(email){
        var defer = q.defer();
        var query = conn.query('SELECT * FROM user WHERE ?',{email:email},function(err,result){
            if(err){
                defer.reject(err);
            }
            else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}
module.exports ={
    addUser:addUser,
    getUserByEmail: getUserByEmail
}
