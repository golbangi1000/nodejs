let users = [{name :'소녀시대', age : 20}, {name: '레드벨벳', age :29},{
name : '티아라', age : 39}];


for( i = 0 ; i < users.length; i++){

    console.log('배열 원소 #' + i+ " : " + users[i].name);
};
//이것보다는 for each 쓰는게 낫다

users.forEach(function(elem, index)
{console.log('배열 원소 #' + index + ' : ' + elem.name)})


users.forEach(function(elem, index,arr)
{let boom = arr[index].age = elem.age * 10
console.log(boom)})

console.log(users[0])




