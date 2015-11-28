var express = require('express');
var mysql = require('mysql');

var router = express.Router();
var connection = mysql.createConnection({

	'host' : 'zium.csap5jgnsd0t.us-west-2.rds.amazonaws.com',
	'user' : 'awsuser',
	'password' : 'my_aws_password',
	'database' : 'zium',
});


router.get('/', function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
	connection.query('select * from store_profile order by regdate;', function (error, cursor) {
		
		res.json(cursor);
		console.log(cursor);
	});
});
//메일아이디,도메인,경로,카테고리,메뉴,메뉴평점,메뉴평가내용,서비스평점(위생,직원친절도),서비스평가내용,재방문의사

router.post('/:id_store', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	var email_id=req.body.email_id;
	var domain=req.body.domain;
	var howto=req.body.howto;
	var id_store=req.params.id_store;
	var category=req.body.category;
	var menu_name=req.body.menu_name;
	var point=req.body.point;
	var menu_comment=req.body.menu_comment;
	var clean_point=req.body.clean_point;
	var kind_point=req.body.kind_point;
	var service_comment=req.body.service_comment;
	var revisit=req.body.revisit;

	var query_user='insert into user(email_id, domain) values (\"' +email_id+ '\", \"' +domain+ '\");';
	connection.query(query_user, function( error, info){
		if(error==null){
			console.log(info);
			var query_survey='insert into survey(id_store, id_user) values (' +id_store+ ', ' +info.insertId+ ');';
			console.log(query_survey);
			connection.query(query_survey, function(error, info){
				if(error==null){
					console.log(info);
					var query_survey_menu='insert into survey_menu(id_survey, menu_name, point, comment) values (' +info.insertId+ ', \"' +menu_name+ '\", ' +point+ ', \"' +menu_comment+ '\");';
					var query_survey_service='insert into survey_service(id_survey, kind_point, clean_point, comment) values (' +info.insertId+ ', ' +kind_point+ ', ' +clean_point+ ', \"' +service_comment+ '\");';
					var query_survey_howto='insert into survey_howto(id_survey, howto, returnvisit) values (' +info.insertId+ ', ' +howto+ ', ' +revisit+ ');';
					console.log(query_survey_menu);
					console.log(query_survey_service);
					console.log(query_survey_howto);
					connection.query(query_survey_menu, function(error, info){
											if(error==null){
												console.log(info);
											}
											else{
												console.log(error);
												res.status(503).json({
													result : false, reason : "fail insert survey_menu"
												});
											}
										});
					connection.query(query_survey_service, function(error, info){
                                            if(error==null){
                                                    console.log(info);
                                            }
                                            else{
                                                    console.log(error);
                                                    res.status(503).json({
                                                            result : false, reason : "fail insert survey_service"
                                                    });
                                            }
                                        });

					connection.query(query_survey_howto, function(error, info){
                                            if(error==null){
                                                    console.log(info);
                                            }
                                            else{
                                                    console.log(error);
                                                    res.status(503).json({
                                                            result : false, reason : "fail insert survey_howto"
                                                    });
                                            }
                                        });
					res.json({
						result : true
					});

				}
				else{
					console.log(error);
					res.status(503).json({
						result :false, reason : "fail insert survey"
					});
				}
			});
		}
		else{
			console.log(error);
			res.status(503).json({
				result : false, reason : "fail insert user"
			});
		}		
	});
	//var query_menu='insert into menu(id_store, category, menu_name) values (?, ?, ?);, [id_store, category, menu_name]';
	//var query_survey='inset into survey(id_store, id_user) values (?, ?);, [id_store, ?????]';
});
/*
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
*/

router.get('/:id_store/howto', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	var query='SELECT SUM(IF(survey_howto.howto = 1, 1, 0)) as \'howto_1\', SUM(IF(survey_howto.howto = 2, 1, 0)) as \'howto_2\', SUM(IF(survey_howto.howto = 3, 1, 0)) as \'howto_3\', \
    			SUM(IF(survey_howto.howto = 4, 1, 0)) as \'howto_4\', SUM(IF(survey_howto.howto = 5, 1, 0)) as \'howto_5\' FROM survey INNER JOIN survey_howto \
    			WHERE survey.id_store = '+req.params.id_store+' AND survey.id_survey = survey_howto.id_survey;';
	console.log(query);
	connection.query(query, function (error, cursor) {
		console.log(cursor);
		res.json(cursor);
	});
});

router.get('/:id_store/returnvisit', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	var query='SELECT SUM(IF(survey_howto.returnvisit = 1, 1, 0)) as \'rv_1\', SUM(IF(survey_howto.returnvisit = 2, 1, 0)) as \'rv_2\', SUM(IF(survey_howto.returnvisit = 3, 1, 0)) as \'rv_3\', \
    			SUM(IF(survey_howto.returnvisit = 4, 1, 0)) as \'rv_4\', SUM(IF(survey_howto.returnvisit = 5, 1, 0)) \'rv_5\' FROM survey INNER JOIN survey_howto \
    			WHERE survey.id_store = '+req.params.id_store+' AND survey.id_survey = survey_howto.id_survey;';
	console.log(query);
	connection.query(query, function (error, cursor) {
		console.log(cursor);
		res.json(cursor);
	});
});

module.exports = router;

