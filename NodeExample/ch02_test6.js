var calc2 = require('./calc2');


console.log('모듈로 분리한후 - calc2.add: ' + calc2.add(100 +1,100));

console.log('곱셈:' + calc2.multiply(12 , 12));


var nconf = require('nconf');


nconf.env();
var value = nconf.get('OS');

console.log('OS환경변수값:' + value);