var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : 'zium.csap5jgnsd0t.us-west-2.rds.amazonaws.com',
	'user' : 'awsuser',
	'password' : 'my_aws_password',
	'database' : 'zium',
});

router.all('/profile/:id_store_profile', function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

router.get('/', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
	connection.query('select * from store_profile order by regdate;', function (error, cursor) {
		
		res.json(cursor);
		console.log(cursor);
	});
});

router.get('/profile/:id_store_profile', function(req, res, next) {
	var pass=req.param("password");
	var id=req.param("id");
	console.log(pass);
	console.log(id);
	var query='select * from store_profile where password='+pass+' and store_name=\''+id+'\' order by regdate;';
	console.log(query);
	connection.query(query, function (error, cursor) {
		console.log(cursor);
		res.json(cursor);
	});
});

router.get('/:id_store', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
	connection.query('select store_name, imgName from store where id_store=1;', function (error, cursor) {
		res.json(cursor);
		console.log(cursor);
	});
});

router.get('/shopping', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
	connection.query('select shopping_name, benefit, imgName, content from shopping;', function (error, cursor) {
		res.json(cursor);
		console.log(cursor);
	});
});

module.exports = router;
