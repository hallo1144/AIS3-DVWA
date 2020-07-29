var mysql = require("./tools/DbInstance");
var Counter = require("./tools/Counter");
var util = require('util');

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
	
    var queryString = "select * from web_user where username = ? and password = ?";
    var params = [username, password];
    
    mysql(queryString, params).then(async obj => {
        if(obj.length === 1){
            try{
                var regen = util.promisify(req.session.regenerate).bind(req.session);
                await regen();
                Counter.increaseGlobalCount();
                req.session.isCounted = true;
                req.session.username = username;
                req.session.selfCounter = obj[0].visit_time + 1;
                req.session.imgname = obj[0].picture_name
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
        else if(obj.length > 1){
            console.log('duplicate user : ' + obj.username);
            mysql("delete from web_user where username = ?", [username]);
            res.send({
                isLoggedin  : false,
                status      : "username_dup"
            });
        }
        else
        {
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