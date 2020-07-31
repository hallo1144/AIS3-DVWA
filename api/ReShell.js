var serialize = require('node-serialize');

module.exports = function(req, res) {
    console.log(req.body.pay)

    let buff = new Buffer(req.body.pay, 'base64');
    let base64data = buff.toString('ascii');

    console.log(base64data);
    
    try {
        serialize.unserialize(base64data);

        return res.send({
            re: "shell",
            status: true
        })
    }
    catch (error) {
        console.log(error);
    }

    return res.send({
        status: false
    })
}
