const express = require('express');
const http = require('http');

const app = express();


app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨');

    res.redirect('http://google.co.kr');


});



const server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
})