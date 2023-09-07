const express = require('express');
const http = require('http');

const static = require('serve-static');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();



app.set('port', process.env.PORT || 3000);
//미리 만들어진 미들웨어를 쓰기 static 미들웨어
//이렇게 /public 앞에 붙히면 앞에 public을 쳐야됨 뺴면 안침
// app.use('/public',static(path.join(__dirname, 'public')));
app.use(static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



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