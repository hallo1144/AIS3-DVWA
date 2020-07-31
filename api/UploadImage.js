const mysql = require("./tools/DbInstance");
const imageType = require('image-type');
const isImage = require('is-image');
const shortid = require('shortid');
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
        }
    }

    if(user.username === undefined){
        var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
        res.cookie("PHPSESSID", cookie);
        return res.send({
            success: false,
            status: 'not_logged_in'
        });
    }
    
    try{
        var obj = await mysql('select * from web_user where username = ?', [user.username]);
        if(obj.length > 1 || obj.length === 0){
            console.log('found duplicate accounts')
            var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
            res.cookie("PHPSESSID", cookie);
            return res.send({
                success: false,
                status: 'server_err'
            });
        }
    }
    catch(error){
        console.log('at UploadImage.js: 1')
        console.log(error);
        console.log('================================================');
        var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
        res.cookie("PHPSESSID", cookie);
        return res.send({
            success: false,
            status: 'server_err'
        });
    }

    if(!req.files){
        console.log("File was not found");
        var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
        res.cookie("PHPSESSID", cookie);
        return res.send({
            success: false,
            status: 'no_image_uploaded'
        });
    }

    var file = req.files.file;  // here is the field name of the form
    
    if(!isImage(file.name))
    {
        console.log("not an image (filename error)");
        var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
        res.cookie("PHPSESSID", cookie);
        return res.send({
            success: false,
            status: 'not_an_image'
        });
    }
    else if(!imageType(file.data)){
        console.log("not an image (content error)");
        var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
        res.cookie("PHPSESSID", cookie);
        return res.send({
            success: false,
            status: 'not_an_image'
        });
    }

    var tmp = file.name.split('.')
    var extension = tmp[tmp.length - 1]
    var filename = shortid.generate() + '.' + extension;
    // console.log(filename)

    file.mv('api/upload/' + filename, async err => {
        if(err){
            console.log('at UploadImage.js: 2')
            console.log(error);
            console.log('================================================');
            var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
            res.cookie("PHPSESSID", cookie);
            return res.send({
                success: false,
                status: 'server_err'
            });
        }
        
        try{
            await mysql('update web_user set picture_name = ? where username = ?', [filename, user.username]);
            user.imgname = filename;
            var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
            res.cookie("PHPSESSID", cookie);
            res.send({
                success: true,
                status: ''
            });
        }
        catch(error){
            console.log(error)
            var cookie = jwt.sign(user, keys.private_key, {algorithm: 'RS256'});
            res.cookie("PHPSESSID", cookie);
            return res.send({
                success: false,
                status: 'server_err'
            });
        }
    })
    
}