let fs = require('fs');

//이건 비동기 방식   //동기 방식은 test5
fs.readFile('./package.json', 'utf8', function(err, data){
    console.log(data);
});
//비동기적이니깐 밑에 코드가 있으면 그냥 그 코드로 넘어가고 
// 파일을 다 읽었을때 실행됨 


