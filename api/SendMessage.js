var mysql = require("./tools/DbInstance");

module.exports = async function(req, res){
    if(req.session.username === undefined){
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

    var username = req.session.username;
    var params = [username, message];
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