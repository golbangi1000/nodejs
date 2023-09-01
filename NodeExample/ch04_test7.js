let fs = require('fs');

fs.writeFile('./output.txt', 'hello111',function(err){
    if(err){
        console.log('에러발생' + err)
        console.dir(err)
        return;
    }

    console.log('output.txt 파일에 데이터 쓰기 완료함')

});
