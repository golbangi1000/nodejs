const express = require('express');
const http = require('http');

const app = express();


app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨');

    const userAgent = req.header('User-Agent');
    let paramName = req.query.name;


    res.send('<h3>서버에서 응답 : User-Agent' + userAgent+ '</h3>'
    + '<h3> Param Name -> ' + paramName + '</h3>');
    
});



const server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
})