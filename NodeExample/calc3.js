
let EventEmitter = require('events').EventEmitter;
const { type } = require('os');
let util = require('util')

let Calc = function(){
            //stop이라는 event가 발생했을떄
    this.on('stop', function(){
        console.log('Calc에 stop 이벤트 전달됨.')
    });
};


util.inherits(Calc, EventEmitter);


Calc.prototype.add = function(a,b){
    return a + b;
};

module.exports = Calc; 

