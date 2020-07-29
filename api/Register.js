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
    else if(password.length < 1){
        return res.send({
            isRegistered  : false,
            status      : "pass_too_short"
        });
    }
    else if(username.split('<').length !== 1 || password.split('<').length !== 1){
        return res.send({
            isRegistered  : false,
            status      : "xss_found"
        });
    }
    else if(username.length > 48 || password.length > 48){
        return res.send({
            isRegistered  : false,
            status      : "acc_pass_too_long"
        });
    }
	
    var queryString = "select username from web_user where username = ?";
    var params = [username];
    
    mysql(queryString, params).then(async obj => {
        if(obj.length !== 0){
            return res.send({
                isRegistered  : false,
                status      : "username_dup"
            });
        }
        
        var queryString = "insert into web_user values (?, ?, 'default.png', 1)";
        var params = [username, password];
        try{
            await mysql(queryString, params);
        }
        catch(error){
            console.log('at Register.js: 1')
            console.log(error);
            console.log('================================================');
            return res.send({
                isRegistered  : false,
                status      : "server_err"
            });
        }

        try{
            var regen = util.promisify(req.session.regenerate).bind(req.session);
            await regen();
            Counter.increaseGlobalCount();
            req.session.isCounted = true;
            req.session.username = username;
            req.session.selfCounter = 1;
            req.session.imgname = 'default.png'

            res.send({
                isRegistered  : true,
                status      : ""
            });
        }
        catch(error){
            console.log('at Register.js: 2')
            console.log(error);
            console.log('================================================');
            queryString = 'delete from web_user where username = ? and password = ?';
            await mysql(queryString, params);

            res.send({
                isRegistered  : true,
                status      : "server_err"
            });
        }
    }).catch( error => {
        console.log('at Register.js: 3')
        console.log(error);
        console.log('================================================');
        res.send({
            isRegistered  : false,
            status      : "server_err"
        });
    });
}