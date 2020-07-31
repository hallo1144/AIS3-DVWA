var fs = require("fs");
var private_key = fs.readFileSync("api/tools/key.pri");
var public_key = fs.readFileSync("api/key.pem");

module.exports = {
    public_key: public_key,
    private_key: private_key
};