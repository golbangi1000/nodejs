const express = require('express');
const http = require('http');

const static = require('serve-static');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const expressSession = require('express-session');

//에러 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');

// mongodb 모듈 사용

 const mongoClient = require('mongodb').MongoClient;

 let database;

 function connectDB(){
    let databaesUrl = 'mongodb://localhost:27017/local'

    MongoClient.connect(databaesUrl, function(err,db){
        if(err) {
            console.log('데이터베이스 연결시 에러 발생함.')
            return;
        }

        console.log('데이터베이스에 연결됨:' +  databaesUrl);
        databse = db;

    });
 }


const app = express();



app.set('port', process.env.PORT || 3000);
//미리 만들어진 미들웨어를 쓰기 static 미들웨어
//이렇게 /public 앞에 붙히면 앞에 public을 쳐야됨 뺴면 안침
app.use('/public', static(path.join(__dirname, 'public')));


//body parser 대신 express씀 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));


var router = express.Router();

router.route('/process/login').post(function(req,res){
    console.log('/process/login 라우팅 함수 호출됨');

    const paramId = req.body.id || req.query.id;
    const paramPassword = req.body.password || req.query.password;

    console.log('요청한 파라미터 : ' + paramId);

});

app.use('/', router);


const authUser = function(db, id , password, callback) {
    console.log('authUser 호출됨'+ id + ', ' + password);

    let users = db.collection('users');

    users.find({"id":id,"password":password}).toArray(function(err,docs){
        if(err){
            callback(err,null);
            return;
        }
        if(docs.length > 0){
            console.log('일치하는 사용자를 찾음');
            callback(null,docs);
        } else{
            console.log('일치하는 사용자를 찾지못함')
            callback(null, null);
        }
    });
}






//404 에러 페이지 처리 
const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});


//데이터베이스는 웹서버 실행되는 상태를 확인하고 database실행 
const server = http.createServer(app).listen(app.get('port'), function () {
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));

    connectDB();
})