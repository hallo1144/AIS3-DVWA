var Counter = require("./tools/Counter");
var jwt = require("jsonwebtoken");
var keys = require("./tools/KeyManager");

var path = require('path');

// session usage:
// isCounted: user is counted by global counter
// selfCounter: persional view times
// username: username of an account, undefined if not logged in
// imgname: personal image path of user, default.png if not set or not logged in

module.exports = function(req, res){
    var verified = true;

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
        console.log('root set session')
        console.log('================================================');
    }
    else{
        try{
            var user = jwt.verify(req.cookies.PHPSESSID, keys.public_key, {"algorithms": ["HS256", "RS256"]});
        }
        catch(err){
            console.log("get invalid jwt.")
            verified = false;
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

    console.log('fetched from ' + user.username);
    res.send({
        isloggedin: user.username === undefined ? false : true,
        verified: verified
    });
}