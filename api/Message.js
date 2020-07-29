var mysql = require("./tools/DbInstance");

module.exports = async function(req, res){
    imgpath = {}
    ret_message = {}
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
                own: obj[i].username === req.session.username,
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