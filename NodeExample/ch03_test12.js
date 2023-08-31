let users = [{name : '소녀시대', age : 20}, {name : '레드벨벳', age : 23}];

console.log('배열 원소의 갯수 : ' + users.length);


users.unshift({name: '티아라', age: 30});

console.log('배열 원소의 갯수 : ' + users.length);

console.dir(users);

let elem = users.shift();
console.log('배열 원소의 갯수  :' + users.length);
console.dir(elem);

