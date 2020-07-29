var Counter = require("./tools/Counter");

module.exports = function(req, res){
    var username = req.session.username || 'default user';
    res.send({
        global_count: Counter.getGlobalCount(),
        personal_count: req.session.selfCounter,
        username: username
    })
}