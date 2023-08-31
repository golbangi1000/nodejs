function add(a,b, callback){
   let result =  a+b;
    callback(result);
};


add(10,10, function(result2){
    console.log('더하기 결과 (콜백함수 안에서 나온거): '  + result2);
});

function boom(a,b,func){

    let result = a + b;

    func(result);
}

boom(1,2,function(asdf){
    console.log('더하기 결과 (콜백함수 안에서 나온거): '  + asdf);
});


