var Counter = require("./tools/Counter");
var util = require('util');

// session usage:
// isCounted: user is counted by global counter
// selfCounter: persional view times
// username: username of an account, undefined if not logged in
// imgname: personal image path of user, default.png if not set or not logged in

module.exports = async function(req, res){
    if(req.session.username === undefined){
        // console.log('logout already')
        return res.send('ok')
    }

    try{
        console.log('================================================');
        console.log('logout: before')
        console.log(req.session)
        var regen = util.promisify(req.session.regenerate).bind(req.session);
        await regen();
        Counter.increaseGlobalCount();
        req.session.isCounted = true;
        req.session.selfCounter = 1;
        req.session.imgname = 'default.png'
        console.log('logout: after')
        console.log(req.session)
        console.log('================================================');
    }
    catch(err){
        console.log('at Logout.js: ')
        console.log(err);
        console.log('================================================');
    }
    finally{
        res.send('ok')
    }
}