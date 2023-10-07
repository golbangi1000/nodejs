var require  = function(path){
    const exports = {};
        exports.getUser = function(){
            return {id: 'test01', name: '소녀시대'}
        };
        exports.group = {id: 'group01', name: '친구'}
    

    return exports;
};
//모듈을 쓴건 아니지만 모듈을 설명하는거 nodejs에서 require함수를 미리 이렇게 만들어 놓은것 
//
var user = require('...');

function showUser(){
    return user.getUser().name + ', ' + user.group.name
}


console.log(showUser());