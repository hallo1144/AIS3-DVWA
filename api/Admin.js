const { response } = require("express");
const mysql = require("./tools/DbInstance");

module.exports = function(req, res) {
    const ip = req.headers['x-forwarded-for'].split(",")[0] || req.connection.remoteAddress;
    if (ip == "localhost") {
        let userList = [];
        var queryString = "select * from web_user;";
        
        mysql(queryString).then(obj => {
            if(obj.length >= 1){
                try{
                    for (let row of obj) {
                        userList.push({
                            "username": row["username"],
                            "visit_time": row["visit_time"]
                        });
                    }
                }
                catch(error){
                    console.log('at Login.js: 1')
                    console.log(error);
                }
                finally{
                    res.send({
                        isLocalhost: true,
                        userList: userList
                    })
                }
            }
        }).catch(error => {
            console.log('at Login.js: 2')
            console.log(error);
            console.log('================================================');
            res.send({
                isLoggedin  : true,
                userList    : [],
                status      : "server_err"
            });
        });
    } else {
        res.send({
            isLocalhost: false,
            userList: []
        })
    }
}