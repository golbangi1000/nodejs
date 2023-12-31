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

//데이터베이스 연결
function connectDB(){

	//데이터베이스 연결 정보
	var databaseUrl = 'mongodb://127.0.0.1:27017/local';

	//연결
	mongoose.connect(databaseUrl); //몽고DB의 정보를 몽구스모듈과 연결해준다.
	
	database = mongoose.connection;
	
	database.on("open",function(){//open이라는 내장이벤트 db가 열려있냐
		
		console.log(" 데이터베이스가 연결 되었습니다: " + databaseUrl); //여기까지왔으면 DB연결 성공
		
		//스키마 정의
		UserSchema = mongoose.Schema({
			id:String,
			name:String,
			pwd:String
			
		});
		
		console.log("UserSchema 정의함.");
		
		//Model 정의 - 스키마를 정의했으면 Model를 정의해야 함
		UserModel = mongoose.model("users",UserSchema);//users 테이블에 UserSchema를 적용해라
		
		console.log("UserModel 정의함.");
		
	}); 

						//function자리에 한번에써준것.
	database.on("error",console.error.bind(console,"몽구스 모듈 에러")); //이렇게 한줄로 써줄수도있다.
									
	database.on("disconnected",function(){
		
		console.log("DB연결이 끊겼습니다 5초후 재연결 합니다.");
		setInterval(connectDB(),5000); //디비연결이 끊기면 5초마다 다시 연결하는 함수를 실행
	});
}

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

//작업하는 함수를 만들고 그걸 불러쓰는 라우터를 만듬.
//사용자를 인증하는 함수
var authUser = function(database,id,pwd,callback){ 

	console.log("authuser 함수 호출");

	// UserModel.find({"id":id,"pwd":pwd},async (err,result) =>{
		
	// 	if(err){
	// 		callback(err,null); 
	// 		return;
	// 	}

	// 	if(result.length>0){

	// 		callback(null,result); 

	// 	}else{

	// 		console.log("일치하는 데이터가 없습니다.");
	// 		callback(null,null); 
	// 	}
	// });
	
	UserModel.find({"id":id,"password":pwd})
	.then(result => {
		if(result.length>0){
			callback(null,result)
		} else{
			console.log(result);
			console.dir(result);
			console.log('일치하는 데이터가 없습니다');
			callback(null,null)
		}
	})
	.catch((err) =>{
		callback(err,null);
		return
	})

}

//사용자를 추가하는 함수
var addUser = function(database,id,pwd,name,callback){

	console.log("addUser 함수 호출");

	var users = new UserModel({"id":id,"password":pwd,"name":name});
	// console.log(users);
	// console.dir(users);
	// users.save(function(err,result){

	// 	if(err){
	// 		callback(err,null);	
	// 		return;
	// 	}

	// 	if(result){

	// 		console.log("사용자 추가~");
			

	// 	}else{

	// 		console.log("사용자 추가 실패 ㅠ-ㅠ");
	// 	}

	// 	callback(null,result);
	// });

	users.save()
	.then(result => {
		console.dir(result)
		console.log(result)
		if(result){
			console.log('사용자 추가됨')
			callback(null,users);
		} else{
			console.log('사용자 추가 실패')
		}
	})
	.catch(err =>{
		callback(err,null)
		return;
	})
};

//-----------------------------------------------------------------------------
//라우터 객체 생성
var router = express.Router();

//로그인 라우터
router.route("/process/login").post(function(req,res){

	console.log("/process/login 호출");

	var id = req.body.id;
	var pwd = req.body.pwd;

	if(database){
		//callback함수가 되는것
		authUser(database, id, pwd, function(err,result){ //위 사용자 인증 함수로 올라감

			if(err) throw err;

			if(result){ //데이터가 있으면

				var userName = result[0].name;//위에서 데이터를 배열로 받기로 했슴
				
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


	}else{

		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>DB연결 실 패 ㅠ-ㅠ</h1>");
		res.write("<div>DB를 연결하지 못했습니다</div>");
		res.end();

	}



});

router.route("/process/addUser").post(function(req,res){

	console.log("/process/addUser 호출");

	var id = req.body.id;
	var pwd = req.body.pwd;
	var name = req.body.name;

	if(database){

		addUser(database,id,pwd,name, function(err,result){ //함수속 매개변수는 사용자 정의

			if(err) throw err;

			if(result){

				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 성공</h1>");
				res.write("<h2>사용자 ID" + id+"이름:"+ name+ "</h2>")
				res.end();


			}else{

				res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
				res.write("<h1>사용자 추가 실패</h1>");
				res.end();

			}

		});

	}else{

		res.writeHead("200",{"Content-type":"text/html;charset=utf-8"});
		res.write("<h1>DB연결 실 패 ㅠ-ㅠ</h1>");
		res.write("<div>DB를 연결하지 못했습니다</div>");
		res.end();

	}

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

	//DB연결 함수 호출
	connectDB(); 

});