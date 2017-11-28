var bcrypt = require("bcrypt");
var config = require("config");
//var bcryptjs = require("bcryptjs");
var crypto = require('crypto');

var hash = function(password) {
    return crypto.createHash('sha1').update(password).digest('base64');
}

function hash_password(password){
    let saltRound = config.get("salt");

    let salt = bcrypt.genSaltSync(saltRound);
    let hash = bcrypt.hashSync(password,salt);
    return hash;
}

function compare_password(password,hash){
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    hash_password:hash_password,
    compare_password:compare_password,
    hash:hash
    // compare:compare
}
