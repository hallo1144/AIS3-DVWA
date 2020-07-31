var Counter = require("./tools/Counter");
var keys = require("./tools/KeyManager");
var jwt = require("jsonwebtoken");

module.exports = async function(req, res){
    if(req.cookies.PHPSESSID !== undefined)
    {
        try{
            var user = jwt.verify(req.cookies.PHPSESSID, keys.public_key, {"algorithms": ["HS256", "RS256"]});
            if(user.username !== undefined){
                Counter.increaseGlobalCount();
            }
        }
        catch(err){
        }
    }

    var user = {
        username: undefined,
        isCounted: true,
        selfCounter: 1,
        imgname: 'default.png'
    };
    var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
    res.cookie("PHPSESSID", cookie);
    res.send('ok')
}