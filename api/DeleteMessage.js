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

    username = user.username;
    if(username === undefined){
        return res.send({
            success: false,
            status: 'server_err'
        })
    }
    else if(req.body.id === undefined || parseInt(req.body.id) === NaN || parseInt(req.body.id) < 0){
        return res.send({
            success: false,
            status: 'server_err'
        })
    }
    
    params = [parseInt(req.body.id)]
    try{
        obj = await mysql('select username from messages where id = ?;', params);
        if(obj.length === 0){
            return res.send({
                success: false,
                status: 'server_err'
            })
        }
        else if(obj[0].username !== username){
            return res.send({
                success: false,
                status: 'not_owner'
            })
        }

        await mysql('delete from messages where id = ?;', params);
        return res.send({
            success: true,
            status: ''
        })
    }
    catch(err){
        console.log('at DeleteMessage.js:')
        console.log(err);
        console.log('================================================');
        return res.send({
            success: false,
            status: 'server_err'
        });
    }
}