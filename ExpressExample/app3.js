const express = require('express');
const http = require('http');


const app = express();


app.set('port', process.env.PORT || 3000);

//미들웨어
app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨');

    //사용자 확인을 하는거라고 하면
    // req.user은 커스텀키
    req.user = 'mike';

    next();

    
});

app.use('/',function(req,res,next){
    console.log('두번째 미들웨어 호출됨');
        //첫번째 미들웨어에서 만든걸 쓰기 
    // res.writeHead(200, {"Content-Type" : "text/html;charset=utf-8"});
    // res.end('<h1>서버에서 응답한 결과입니다 :' + req.user +'</h1>');

    // 위에 두개 안쓰고 그냥 send를 쓸수도 있다 좀 더 간단하게 응답을 보내는 방법
    // res.send('<h1>서버에서 응답한 결과입니다 :' + req.user +'</h1>');

    //json 포맷으로 보내짐
    const person = {name : '소녀시대', age :'20'};
    // res.send(person)

    //json 말고 string으로 보내고싶을때 
    const personStr = JSON.stringify(person);
    // res.send();


    res.writeHead(200, {"Content-Type" : "application/json;charset=utf8"});
    res.write(personStr);
    res.end();

})



const server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹서버를 실행함 : ' + app.get('port'));
})


