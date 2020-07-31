var Counter = require("./tools/Counter");
var keys = require("./tools/KeyManager");
var jwt = require("jsonwebtoken");

module.exports = function(req, res){
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

    var username = user.username || 'default user';
    res.send({
        global_count: Counter.getGlobalCount(),
        personal_count: user.selfCounter,
        username: username
    })
}