var mysql = require('./DbInstance');

var value = 0

var Counter = {
    value: value,
    getGlobalCount: () => {
            return value;
    },
    increaseGlobalCount: () => {
        value++;
        console.log('global views increase to ' + value)
    },
    // save: function(){
    //     console.log('value : ' + value)
    //     var query = "update global_count set value = ? where name = 'idx'";
    //     var param = [value];
    //     mysql.query(query, param, function(error){
    //         if(error){
    //             console.log(error);
    //             return;
    //         }
    //     });
    // },
    // load: function(){
    //     var query = "select * from global_count";

    //     mysql(query, []).then( obj => {
    //         if (obj.length > 1) {
    //             console.log(error);
    //             return;
    //         }
    //         else if (obj.length === 0) {
    //             var query = "insert into global_count values ('idx', ?)";
    //             var param = [value];
    //             mysql(query, param);
    //             return;
    //         }

    //         console.log('prev value : ' + obj[0].value);
    //         value = obj[0].value;
    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }
}

module.exports = Counter;