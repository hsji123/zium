var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : 'zium.csap5jgnsd0t.us-west-2.rds.amazonaws.com',
	'user' : 'awsuser',
	'password' : 'my_aws_password',
	'database' : 'zium',
});

/*
router.get('/', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
	connection.query('select * from store_profile order by regdate;', function (error, cursor) {
		
		res.json(cursor);
		console.log(cursor);
	});
});
*/
router.get('/profile', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	var pass=req.param("password");
	var id=req.param("id");
	console.log(pass);
	console.log(id);
	var query='select * from store_profile where password=md5('+pass+') and store_name=\''+id+'\' order by regdate;'; // id_store_profile add need
	console.log(query);
	connection.query(query, function (error, cursor) {
		console.log(cursor);
		res.json(cursor);
	});
});

//이미지 가게소개 내용
router.post('/profile/:id_store_profile', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	var address=req.body("address");
	var phone=req.body("phone");
	var email=req.body("email");
	var store_img=req.body("store_img");
	var store_content=req.body("store_content");

	console.log(address);
	console.log(phone);
	console.log(email);
	if(req.param("password")!=null){
		var pass=req.param("password");
		console.log(pass);
		var query='update store_profile set address=\"'+address+'\", phone=\"'+phone+'\", email=\"'+email+'\", password=\"'+pass+'\", store_img=\"'+store_img+'\", store_content=\"'+store_content+'\" where id_store_profile='+req.params.id_store_profile+';'
	}
	else{
		var query='update store_profile set address=\"'+address+'\", phone=\"'+phone+'\", email=\"'+email+'\" , store_img=\"'+store_img+'\", store_content=\"'+store_content+ '\" where id_store_profile='+req.params.id_store_profile+';'
	}
	console.log(query);
	connection.query(query, function (error, info) {
		console.log(info);
		res.json({
			result : true
		});
	});
});

router.get('/shopping', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var query = 'select shopping_name, benefit, imgName, content from shopping;';
	connection.query(query, function (error, cursor) {
//	connection.query('select * from shopping;', function (error, cursor) {
		console.log(query);
		res.json(cursor);
		console.log(cursor);
	});
});

router.get('/:id_store', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var query = 'select store_name, imgName from store where id_store='+req.params.id_store+';';
	connection.query(query , function (error, cursor) {
		console.log(query);
		res.json(cursor);
		console.log(cursor);
	});
});

router.get('/:id_store/menu', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var query = 'select sub.id_user, sub.menu_name, sub.point, sub.comment, user.email_id, sub.regdate from \
		(select survey.id_user, survey.id_store, survey.id_survey, survey_menu.menu_name, survey_menu.point, survey_menu.comment, survey_menu.regdate \
			from survey inner join survey_menu where survey.id_store='+req.params.id_store+' and survey.id_survey=survey_menu.id_survey) as sub \
			inner join user where sub.id_user=user.id_user;';
	connection.query(query , function (error, cursor) {
		console.log(query);
		res.json(cursor);
		console.log(cursor);
	});
});

router.get('/:id_store/category', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var query = 'select category, menu_name  from menu where id_store='+req.params.id_store+' order by category;';
	connection.query(query , function (error, cursor) {
		console.log(query);
		res.json(cursor);
		console.log(cursor);
	});
});

router.get('/:id_store/category_list', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var query = 'select distinct(category) from menu where id_store='+req.params.id_store+' order by category;';
	connection.query(query , function (error, cursor) {
		console.log(query);
		res.json(cursor);
		console.log(cursor);
	});
});

router.get('/:id_store/menu_list', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
	var category=req.param("category");
  	var query = 'select menu_name, price from menu where id_store='+req.params.id_store+' and category=\"'+category+'\";';
	connection.query(query , function (error, cursor) {
		console.log(query);
		res.json(cursor);
		console.log(cursor);
	});
});


router.post('/:id_store/DOscrap', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var scrap_name=req.body.scrap_name;
  	var score=req.body.score;
  	var content=req.body.content;
  	var id_email=req.body.id_email;
  	var regdate=req.body.regdate;

  	var query_DOscrap='insert into scrap_content(scrap_name, score, content, id_email, regdate) values \
  						(\"' +scrap_name+ '\", \"' +score+ '\",\"' +content+ '\",\"' +id_email+ '\",\"' +regdate+ '\");';
	connection.query(query_user, function( error, info){
		if(error==null){
			console.log(info);
		}
		else{
			console.log(error);
			res.status(503).json(error);
		}
	});
});

	var query = 'update scrap set scrap_name='+req.body.scrap_name_after+' where id_store_profile='+req.params.id_store_profile+' and scrap_name='+req.body.scrap_name_before+';';
	connection.query(query , function (error, info) {
		if (error == null) {
			console.log(info);
			res.json({
				success : true,
			});
		}
		else{
			console.log(error);
			res.status(503).json(error);
		}
	});
});


router.get('/:id_store_profile/scrap', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var query = 'select scrap_name from scrap where id_store_profile='+req.params.id_store_profile+' order by regdate desc;';
	connection.query(query , function (error, cursor) {
		console.log(query);
		res.json(cursor);
		console.log(cursor);
	});
});

router.post('/:id_store_profile/scrap', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	var query = 'update scrap set scrap_name='+req.body.scrap_name_after+' where id_store_profile='+req.params.id_store_profile+' and scrap_name='+req.body.scrap_name_before+';';
	connection.query(query , function (error, info) {
		if (error == null) {
			console.log(info);
			res.json({
				result : true
			});
		}
		else{
			console.log(error);
			res.status(503).json(error);
		}
	});
});

module.exports = router;
