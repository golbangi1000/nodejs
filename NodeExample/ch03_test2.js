
let person = {}; //중괄호를 이용해서 객체 만들수있음 

console.log(typeof(person))
person['name']  = '소녀시대';
person['age'] = 20;

console.log('이름 : ' + person.name);
console.log('나이 : ' + person.age);
console.log('나이: ' + person['age']);
console.log(typeof(person['age']));








