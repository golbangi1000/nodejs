let users = [{name : '소녀시대', age :30}, {name : '레드벨벳', age : 40}, 
{name : '티아라' , age : 50}];


delete users[1];

console.dir(users);

console.log(users[1]);

users.forEach(function(elem, index, arr){
    console.log("원소 #: " + index);
    console.dir(elem);
});


users.splice(1, 0, {name : '애프터스쿨' , age : 30});

console.log(users.length);
console.dir(users);

users.splice(2,1);

console.log(users.length);
console.dir(users);