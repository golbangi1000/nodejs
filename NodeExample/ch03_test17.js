function add(a,b,callback){

    let result = a + b;

    callback(result);


    let count = 0;
    // result = 0;
    let history = function(aa){
        result = aa + b;
        count += 1;
        return count + ' : ' + aa + ' + ' + b + ' = ' + result; 
    };

    return history;
};


//add를 return하는게 아니라 history를 return함 
var add_history = add(20, 20, function(result){
    //이건 여기서 돌고 끝 
    console.log('더하기 결과: ' + result)
});


console.log('add_history:' + typeof(add_history));

console.log('결과값으로 받은 함수 실행 :' +  add_history(1))
console.log('결과값으로 받은 함수 실행 :' +  add_history(1))
console.log('결과값으로 받은 함수 실행 :' +  add_history(3))

/*
클로저는 내부함수에서 외부함수가 끝나도 내부함수가 외부함수의 변수에
접근 할수있는걸 클로저라고 한다. 
*/
