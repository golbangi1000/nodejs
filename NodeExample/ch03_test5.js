let person = { };

person.name = '소녀시대';

person['age'] = 20;

person.add = function(a,b){
    return a + b
};

console.log(person.add('awef,','wafeaawef'));

console.log(person.add(1,2));