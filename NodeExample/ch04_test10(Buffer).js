let output = '안녕!';
let buffer1 = Buffer.alloc(10);
let len = buffer1.write(output, 'utf8');

let byteLen = Buffer.byteLength(buffer1);

var str1 = buffer1.toString('utf8',0,6);

let buffer2 = Buffer.from('Hello', 'utf8');

let str2 = buffer2.toString('utf8', 0, Buffer.byteLength(buffer2));

console.log('str2: ' +str2);

console.log('두번째 버퍼의 길이: ' + Buffer.byteLength(buffer2)+ "::" + buffer2.length);

console.log('str1 : ' + str1);


console.log('버퍼 객체인지 여부 : ' + Buffer.isBuffer(buffer1));


console.log('문자열의 바이트 길이: ' + byteLen);

console.log('버퍼에 쓰인 문자열의 길이:' + len);

console.log('첫번째 버퍼에 쓰인 문자열: ' + buffer1.toString());




