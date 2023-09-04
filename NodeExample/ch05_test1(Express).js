let http = require('http')
let https = require('https')



//서버를 객체로 만들수있다
let server = http.createServer();


let host = '192.168.35.80'; //ipconfig //all 로 ipv4주소 확인 
let port = 3000;

server.listen(port,host, '50000', function(){
    console.log('웹서버가 실행되었습니다 port :  ' + port + '   host:' + host)
});
//EADDRINUSE 에러 포트 이미 차지하고있음
// 실행중은 웹서버는 정지시켜주고 다른걸 시작하든 다시 시작하든 
/*
    포트가 사용중이면 안됨
*/
// 안그러면 EADDRINUSE에러뜸 
