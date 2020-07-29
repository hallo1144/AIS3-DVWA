var mysql = require("./tools/DbInstance");

module.exports = async function(req, res){
    username = req.session.username;
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