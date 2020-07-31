var express = require("express");
var path = require('path');
var fs = require("fs");
var LoginHandler = require("./Login");
var LogoutHandler = require("./Logout");
var RegisterHandler = require("./Register");
var UploadImageHandler = require("./UploadImage");
var RootHandler = require("./Root");
var ProfileHandler = require("./Profile");
var MessageHandler = require("./Message");
var SendMessageHandler = require("./SendMessage");
var DeleteMessageHandler = require("./DeleteMessage");
var ImageHandler = require("./Image");
var ReShellHandler = require("./ReShell");
var AdminHandler = require("./Admin");
var Counter = require("./tools/Counter");
var keys = require("./tools/KeyManager");
var jwt = require("jsonwebtoken");
const { fstat } = require("fs");
var router = express.Router();

router.get("/", RootHandler);
router.post("/login", LoginHandler);
router.get("/logout", LogoutHandler);
router.post("/register", RegisterHandler);
router.post("/upload", UploadImageHandler);
router.get("/profile", ProfileHandler);
router.get("/message", MessageHandler);
router.post("/sendMessage", SendMessageHandler);
router.post("/deleteMessage", DeleteMessageHandler);
router.post("/editprofile", ReShellHandler);
router.get("/image/:filename", ImageHandler);
router.get("/admin", AdminHandler);

router.get("/profileImage", function(req, res, next){
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

    var filepath = path.join(__dirname, 'upload', user.imgname);
    // var filepath = path.join(__dirname, 'upload', req.cookies.FILEPATH);
    console.log("request " + filepath)

    if(!filepath.startsWith(path.join(__dirname, "../")) || filepath.startsWith(path.join(__dirname, "tools"))){
        return res.send("bad hacker!!!");
    }
    else if(!fs.existsSync(filepath)){
        return next();
    }
    
    try{
        res.sendFile(filepath);
    }
    catch(err){
        console.log('at ProfileImage.js:')
        console.log(user)
        console.log(err);
        console.log('================================================');
        next();
    }
})

module.exports = router;