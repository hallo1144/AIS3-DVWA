var mysql = require("./tools/DbInstance");
var Counter = require("./tools/Counter");
var keys = require("./tools/KeyManager");
var jwt = require("jsonwebtoken");

module.exports = async function(req, res){
    imgpath = {}
    ret_message = {}

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

    try{
        obj = await mysql("select * from messages");
        for(i = 0; i < obj.length; i++){
            if(imgpath[obj[i].username] === undefined){
                obj2 = await mysql('select picture_name from web_user where username = ?;', [obj[i].username]);
                imgpath[obj[i].username] = obj2[0].picture_name;
            }

            ret_message[obj[i].id] = {
                username: obj[i].username,
                message: obj[i].message,
                own: obj[i].username === user.username,
                imgpath: imgpath[obj[i].username]
            };
        }

        return res.send({
            success: true,
            status: "",
            message: ret_message
        });
    }
    catch(err){
        console.log('at Message.js:')
        console.log(err);
        console.log('================================================');
        return res.send({
            success: false,
            status: "server_err",
            message: {}
        });
    }
}