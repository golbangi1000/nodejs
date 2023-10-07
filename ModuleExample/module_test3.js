import user from './user3.js';
// const user  = require('./user3')

function showUser(){
    return user.getUser().name + ',' + user.group.name;
}



console.log(showUser());

