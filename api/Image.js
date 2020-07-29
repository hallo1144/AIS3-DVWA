const fs = require('fs');
const path = require('path');

module.exports = function(req, res){
    f = path.join(__dirname, 'upload', req.params.filename)
    console.log('require ' + f)
    try{
        if(fs.existsSync(f)){
            res.sendFile(f)
        }
        else{
            res.status(404);
            res.send('not found')
        }
    }
    catch(err){
        console.log('at Image.js:')
        console.log(err);
        console.log('================================================');
        return res.send({
            success: false,
            status: 'server_err'
        });
    }
}