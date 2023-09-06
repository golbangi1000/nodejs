const express = require('express');
const http = require('http');


//express 서버 객체
const app = express();

const port = process.env.PORT || 3000;
                        //환경변수 그냥 환경변수 시스템 말고
app.set('port', port);

// let server = http.createServer(app).listen(app.get('port',function()
// {
//     console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
// }));

const server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('익스프레스로 웹서버를 실행함 : ' + port);
});






