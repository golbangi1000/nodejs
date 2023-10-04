let role = 69;

// switch(role){

//     case'guest':{

//         console.log('guest user')
//         break;
//     }

//     case 'moderator':{

//         console.log('mod user')
//         break;
//     }
    
//     case 69:{
//         console.log(69)
//         break;
//     }
//     default:{
//         console.log('unknown user')
//     }
// }

const person={
    name: 'mosh',
    age: 30,
    height: 180

};

const personArray = [
    {
        name: 'mosh',
        age: 30,
        height: 180
    
    },
    {
        name: 'boomboom',
        age: 33,
        height: 110
    
    },
    {
        name: 'asdfh',
        age: 35,
        height: 130
    
    },
]


// for(let key in person){
//     console.log(key, person[key]);

// };

for(let key1 in personArray){
    
    for(key2 in personArray[key1]){
        console.log(personArray[key1][key2]);
    }
};
console.log('-----------------------------------')
for(let key1 of personArray){
    for(let key2 in key1){
        console.log(key1[key2]);
    }
}
for(let key1 of personArray){
    console.log(key1);
}

console.log('-----------------------------------')

function max(a,b){
    if(a > b){
        console.log(a + 'is bigger')
    } else{
        console.log(b + ' is bigger')
    }
}

max(1,2);

