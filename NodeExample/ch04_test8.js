let fs = require('fs');
                    //w라고 하면 쓸수있는 권한을줌
fs.open('./output.txt', 'w', function(err,fd){
     if(err){
        console.log('파일 오픈 시 에러발생');
        console.dir(err);
        return;
     };



     var buf = Buffer.from('안녕하세요','utf-8');
     fs.write(fd, buf,0, buf.length, null, function(err,written,buffer){
        if(err){
            console.log('파일 쓰기시 에러발생');
            console.dir(err)
            return;
        };

        console.log('파일쓰기 완료함');

        fs.close(fd, function(){
            console.log('파일닫기 완료함');
        });
     });
});

