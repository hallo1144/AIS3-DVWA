var mysql = require('mysql');
var options = require('./DbOptions.json');
// var options = require('./temp.json');
var util = require('util');

var pool = mysql.createPool(options);

var query = "CREATE TABLE IF NOT EXISTS web_user (username char(50), password char(50), picture_name char(50), visit_time INT);";
pool.query(query);
query = "CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT, username char(50), message char(100), PRIMARY KEY (id));";
pool.query(query);
query = "CREATE TABLE IF NOT EXISTS sessions (session_id varchar(128), expires int unsigned, data mediumtext, PRIMARY KEY (session_id));";
pool.query(query);

var query_async = util.promisify(pool.query).bind(pool);

module.exports = query_async;