let Calc = require('./calc3');  ///calc3

let calc1 = new Calc();


calc1.emit('stop');


console.log('Calc에 stop 이벤트 전달함');
console.log(calc1.add(1,4));





