let http = require('http');
let fs = require('fs');
let server = http.createServer();
//http 서버 객체

let host = '192.168.35.80';
let port = 3000;

server.listen(port,host,'50000', function(){
    console.log('웹서버가 실행됨');
});

//이 이벤트가 발생했을떄 이 콜백함수를 실행해주세요
// address라고 클라이언트 ip 확인가능 
server.on('connection', function(socket){
    console.log('클라이언트가 접속했습니다');


});


server.on('request', function(req,res){
    console.log('클라이언트 요청이 들어왔습니다');
    // console.dir(req);


    //파일을 읽어서 보내자 
    let filename = 'house.png';
    fs.readFile(filename, function(err, data){
        res.writeHead(200, {"Content-Type":"image/png"});
        res.write(data);
        res.end();

    });

    
    

});