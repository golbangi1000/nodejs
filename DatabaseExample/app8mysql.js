//mongoose 모듈 사용하기

//Express 기본 모듈
require("dotenv").config();
var express = require("express");
var http = require("http");
var path = require("path");
//var bodyParser = require("body-parser"); //예전에는 bodyParser를 호출해야 했지만 express에 내장이 되어 안써도 괜춘
var serveStatic = require("serve-static"); //특정 폴더를 패스로 접근 가능하게 하는것.
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");

//몽고디비 모듈
//var MongoClient = require("mongodb").MongoClient; 몽구스모듈을 쓰면 이렇게 할 필요 없어서 여긴 주석

//mongoose 모듈
var mongoose = require("mongoose");

//데이터베이스 객체를 위한 변수
var database; //==connection conn; 과 같음

//데이터베이스 스키마를 위한 변수
var UserSchema;

//데이터베이스 모델을 위한 변수
var UserModel;

var mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit:10,//connection을 몇개를 만들꺼냐
    host:'localhost',
    user:'root',
    password:'118011',
    database:'test',
    debug:false
});

//익스프레스 객체 생성
var app = express();

app.set("port",process.env.PORT||3000);

app.use(express.urlencoded({extended:false}));

app.use("/public",serveStatic(path.join(__dirname,"public"))); //public (실제)폴더의 이름을 써준것
//사용자정의

app.use(expressSession({

	secret:"my key",
	resave:true,
	saveUninitialized:true

}));

var addUser = function(id, name, age, password,callback){
    console.log('addUser 호출됨')

    pool.getConnection(function(err, conn){
        if (err){
            if(conn){
                conn.release();// 항상 release를 해줘야함
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결의 스레드 아이디 : '  + conn.threadId);


        //뭘 넘길지 객체로 넘겨주면 그대로 저장해줌 
        const data  = {id:id, name:name, age:age, password:password};
        const exec = conn.query('INSERT INTO USERS SET ?', data,
         function(err,result){
            conn.release();
            console.log('실행된 SQL:' + exec.sql);
            // console.dir(exec)
            // console.dir(exec.mysql)

            if(err){
                console.log('SQL 실행시 에러발생')
                callback(err,null)
                return;
            }
            callback(null,result);
        });


    });
};


//작업하는 함수를 만들고 그걸 불러쓰는 라우터를 만듬.
//사용자를 인증하는 함수
var authUser = function(id,password,callback){ 

	console.log("authuser 함수 호출");

    pool.getConnection(function(err, conn){
        if(err){
            if(conn){
                conn.release();
                return;
            } 
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디:' + conn.threadId);

        const tableName = 'users';
        const columns = ['id',  'name', 'age'];
        const exec = conn.query('SELECT ?? FROM ?? WHERE ID  = ? AND PASSWORD = ?', [columns,tableName,id,password],
         function(err, rows){ 
            conn.release();
            console.log('실행된 SQL:' + exec.sql)

            if(err){
                console.log('에러')
                callback(err,null);
                return;
            }
            
        if(rows.length > 0){
            console.log('사용자 찾음 ')
            callback(null,rows);
        } else{
            console.log('사용자 찾지 못함');
            callback(null, null);
        }


        })

       


    });

}

//-----------------------------------------------------------------------------
//라우터 객체 생성
var router = express.Router();

router.route('/process/adduser').post(function(req,res){
    console.log('/process/addUser 라우팅 함수 호출됨')

    const paramId = req.query.id || req.body.id; //get 은 body
    const paramName = req.query.name || req.body.name;
    const paramAge = req.query.age || req.body.age;
    const paramPassword = req.query.password || req.body.password;

    console.log('요청 파라미터 리스트: ' + paramId + ', ' + paramPassword + ', ' + paramName + ', ' + paramAge + ', ');

    const age = Number(paramAge);
    addUser(paramId,paramName, age, paramPassword, function(err,addedUser){
        if(err){

            console.log('에러발생')
            res.writeHead(200,{"Content-type":"text/html;charset=utf-8"});
            res.write('<h1>에러발생</h1>');
            res.write('<h1>      에러:  ' +  err + '</h1>');
            res.end();
            return;
        }

        if(addedUser){
            // console.dir(addedUser);

            res.writeHead(200, {"Content-type":"text/html;charset=utf-8"});
            res.write('<h1>사용자 추가 성공</h1>');
            res.write('<br>');
            res.write('<br>');
            res.write('<a href="/public/login.html">다시 로그인 하기</a>');
            res.end();
        } else{
            console.log('에러발생')
            res.writeHead(200,{"Content-type":"text/html;charset=utf-8"});
            res.write('<h1>사용자 추가실패</h1>');
            res.end();
            return;
        }
    });



});


//로그인 라우터
router.route("/process/login").post(function(req,res){

	console.log("/process/login 호출");

	var id = req.body.id;
	var pwd = req.body.pwd;

		//callback함수가 되는것
		authUser( id, pwd, function(err,rows){ //위 사용자 인증 함수로 올라감

			if(err) throw err;

			if(rows){ //데이터가 있으면
                console.dir(rows);
                
				var userName = rows[0].name;//위에서 데이터를 배열로 받기로 했슴
				
				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 성 공 ~ ~</h1>");
				res.write("<div>아이디: " + id + "</div>");
				res.write("<div>이름: " + userName + "</div>");
				res.write("<br><br><a href='/public/login.html'>다시 로그인</a>");
				res.end();

			}else{

				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>로그인 실 패 ㅠ-ㅠ</h1>");
				res.write("<div>아이디또는 패스워드를 확인하세요</div>");
				res.write("<br><br><a href='/public/login.html'>다시 로그인</a>");
				res.end();

			}

		});


	



});

//라우터 객체 등록
app.use("/",router);

var errorHandler = expressErrorHandler({

	static: { //미리 메모리상에 올려둔것
		"404":"./public/404.html" //404에러가 뜨면 public에 404.html로 가라
	}
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler); //변수명 담아줌


//Express 서버 시작
//var server = http.createServer();

http.createServer(app).listen(app.get("port"),function(){ //위에 set으로 넣어둔 port를 get으로 가져온거

	console.log("익스프레스 서버 on~~ 포트번호는:" + app.get("port"));

	
});