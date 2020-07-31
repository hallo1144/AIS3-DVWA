var mysql = require("./tools/DbInstance");
var Counter = require("./tools/Counter");
var keys = require("./tools/KeyManager");
var jwt = require("jsonwebtoken");

module.exports = async function(req, res){
    if(req.cookies.PHPSESSID === undefined){
        Counter.increaseGlobalCount();
        var user = {
            username: undefined,
            isCounted: true,
            selfCounter: 1,
            imgname: 'default.png'
        };
        var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
        res.cookie("PHPSESSID", cookie);
    }
    else{
        try{
            var user = jwt.verify(req.cookies.PHPSESSID, keys.public_key, {"algorithms": ["HS256", "RS256"]});
        }
        catch(err){
            console.log("get invalid jwt.")
            var user = {
                username: undefined,
                isCounted: true,
                selfCounter: 1,
                imgname: 'default.png'
            };
            var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
            res.cookie("PHPSESSID", cookie);
        }
    }

    if(user.username === undefined){
        return res.send({
            success: false,
            status: 'not_logged_in'
        });
    }

    var message = req.body.message;
    if(message === undefined || message == ""){
        return res.send({
            success: false,
            status: 'no_message'
        });
    }
    
    message = message.replace('\r', '');
    if (/[\x00-\x09\x0B-\x1F\x80-\xFF]/.test(message)){
        return res.send({
            success: false,
            status: 'unprintable_char'
        });
    }

    var params = [user.username, message];
    try{
        await mysql('insert into messages (username,message) value(?,?);', params);
        return res.send({
            success: true,
            status: ''
        });
    }
    catch(err){
        console.log('at SendMessage.js:')
        console.log(err);
        console.log('================================================');
        return res.send({
            success: false,
            status: 'server_err'
        });
    }
}