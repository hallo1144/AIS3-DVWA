var mysql = require("./tools/DbInstance");
var Counter = require("./tools/Counter");
// var util = require('util');
var keys = require("./tools/KeyManager");
var jwt = require("jsonwebtoken");

module.exports = function(req, res){
    // var username = req.query.username;
    // var password = req.query.password;
    var username = req.body.username;
    var password = req.body.password;

    if(username === undefined || password === undefined){
        return res.send({
            isRegistered  : false,
            status      : "miss_acc_or_pass"
            });
    }
    else if(username.length === 0 || password.length === 0){
        return res.send({
            isRegistered  : false,
            status      : "miss_acc_or_pass"
            });
    }
    else if(username.length > 50 || password.length > 50){
        return res.send({
            isLoggedin  : false,
            status      : "acc_pass_too_long"
            });
    }
    
    username = username.replace(/and/ig, "").replace(/or/ig, "").replace(/union/ig, "").replace(/select/ig, "")
    password = password.replace(/and/ig, "").replace(/or/ig, "").replace(/union/ig, "").replace(/select/ig, "")
    var queryString = "select * from web_user where username = '" + username + "' and password = '" + password + "'";
    
    mysql(queryString, {}).then(async obj => {
        if(obj.length > 0){
            Counter.increaseGlobalCount();
            var user = {
                isCounted: true,
                username: username,
                selfCounter: obj[0].visit_time + 1,
                imgname: obj[0].picture_name
            }
            var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
            res.cookie("PHPSESSID", cookie);

            try{
                params = [req.session.selfCounter, username, password]
                await mysql("update web_user set visit_time = ? where username = ? and password = ?", params)
            }
            catch(error){
                console.log('at Login.js: 1')
                console.log(error);
            }
            finally{
                res.send({
                    isLoggedin  : true,
                    status      : ""
                });
            }
        }
        else{
            res.send({
                isLoggedin  : false,
                status      : "username_no_match"
            });
        }
    }).catch(error => {
        console.log('at Login.js: 2')
        console.log(error);
        console.log('================================================');
        res.send({
            isLoggedin  : false,
            status      : "server_err"
        });
    });
}