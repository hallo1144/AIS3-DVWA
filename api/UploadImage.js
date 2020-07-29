const mysql = require("./tools/DbInstance");
const imageType = require('image-type');
const isImage = require('is-image');
const shortid = require('shortid');


module.exports = async function(req, res){
    if(req.session.username === undefined){
        return res.send({
            success: false,
            status: 'not_logged_in'
        });
    }
    
    try{
        var obj = await mysql('select * from web_user where username = ?', [req.session.username]);
        if(obj.length > 1 || obj.length === 0){
            console.log('found duplicate accounts')
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
        return res.send({
            success: false,
            status: 'server_err'
        });
    }

    if(!req.files){
        console.log("File was not found");
        return res.send({
            success: false,
            status: 'no_image_uploaded'
        });
    }

    var file = req.files.file;  // here is the field name of the form
    
    if(!isImage(file.name))
    {
        console.log("not an image (filename error)");
        return res.send({
            success: false,
            status: 'not_an_image'
        });
    }
    else if(!imageType(file.data)){
        console.log("not an image (content error)");
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
            return res.send({
                success: false,
                status: 'server_err'
            });
        }
        
        try{
            await mysql('update web_user set picture_name = ? where username = ?', [filename, req.session.username]);
            req.session.imgname = filename;
            res.send({
                success: true,
                status: ''
            });
        }
        catch(error){
            console.log(error)
            return res.send({
                success: false,
                status: 'server_err'
            });
        }
    })
    
}