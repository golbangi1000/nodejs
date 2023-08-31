console.log('안녕하세요.');

console.log('숫자입니다. %d', 10);
console.log('문자입니다. %s', '안녕');

//person 객체에 name age 속성 
var person = {
    name:'소녀시대',
    age:20
};


//console객체는 전역객체라서 언제 어디서든 사용가능 
console.log('json객체입니다. %j', person );


console.dir(person);



console.time('duration_time')


var count2 = 0;
for (var i  = 0; i < 10000; i++){
    count2+= i;
    
}
console.log('%d', count2);




console.timeEnd('duration_time');



console.log("파일이름: %s", __filename);
console.log('패스 :  %s', __dirname)




process.argv.forEach(function(item, index){
            console.log(index + ": " + item)
            });


            