const fs = require('fs');
const path = require('path');

module.exports = function(req, res, next){
    f = path.join(__dirname, 'upload', req.params.filename)
    console.log('require ' + f)
    try{
        if(fs.existsSync(f)){
            res.sendFile(f)
        }
        else{
            return next();
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