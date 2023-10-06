import {getUser,group} from './user1.js';


function showUser(){
   return  getUser().name + ', ' +  group.name;
}

console.log('사용자정보:' + showUser());

