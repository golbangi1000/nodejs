


// process.on('exit', function(){
//     console.log('exit 이벤트 발생함' )
// });


// setTimeout(function(){
//     console.log('2초후에 실행돼었음');

// }, 10);


// console.log('2초 후에 실행될것임');

process.on('exit', function(){
    console.log('exit 이벤트 실행');
  });
  
  setTimeout(function(){
    console.log('1초 후 시스템 종료');
    process.exit()

  }, 1000);





