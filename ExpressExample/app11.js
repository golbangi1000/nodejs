const express = require('express');
const http = require('http');

const static = require('serve-static');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();



app.set('port', process.env.PORT || 3000);
//미리 만들어진 미들웨어를 쓰기 static 미들웨어
//이렇게 /public 앞에 붙히면 앞에 public을 쳐야됨 뺴면 안침
app.use('/public',static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());


const router = express.Router();

router.route('/process/setUserCookie').get(function(req, res){
    console.log('/process.setUserCookie 라우팅 함수 호출됨');

    res.cookie('user', {
        id: 'mike',
        name: '소녀시대',
        authorized : true
    });

    res.redirect('/process/showCookie');
});


router.route('/process/showCookie').get(function(req,res){
    console.log('/process/showCookie 라우팅 함수 호출됨')

    res.send(req.cookies);
});





router.route('/process/login').post(function(req, res){
    console.log('/process/login 라우팅함수에서 받음.')

    const paramId = req.body.id || req.query.id;
    const paramPassword = req.body.password || req.query.password;
    

    res.writeHead(200, {"Content-Type" : "text/html;charset=utf8"});
    res.write("<h1>서버에서 로그인 응답</h1>")
    res.write("<div><p>" +  paramId +" </p></div>")
    res.write("<div><p>" +  paramPassword +" </p></div>")
    res.end();

});


app.use('/', router); 


app.all('*', function(req,res){
    res.status(404).send('<h1>요청하는 페이지는 없다</h1>')
});


app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨');

    const userAgent = req.header('User-Agent');
    const paramID = req.body.id || req.query.id;


    res.send('<h3>서버에서 응답 : User-Agent:' + userAgent+ '</h3>'
    + '<h3> Param ID -> ' + paramID + '</h3>');
    
});




const server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
})