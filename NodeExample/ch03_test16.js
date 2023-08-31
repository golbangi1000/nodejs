function add(a,b,callback){

    let result = a + b;

    callback(result);

    let history = function(){
        return a + ' + ' + b + ' = ' + result; 
    };

    return history;
};


let add_history = add(20, 20, function(result){
    console.log('더하기 결과: ' + result)

});


console.log('add_history:' + typeof(add_history));


console.log('결과값으로 받은 함수 실행' +  add_history())

