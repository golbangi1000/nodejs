let person1 = {name: '소녀시대', age :20};
let person2 = {name : '걸스데이', age : 23};


function Person(name, age) {
    this.name = name;
    this.age = age;
}



Person.prototype.walk = function(speed){
    console.log(speed + 'km 속도로 걸어갑니다');
};

let person3 = new Person('레드벨벳', 26);
let person4 = new Person('아이브', 23);

person3.walk(3);

let boom = function addd(a,b,callback){

    
    let result = a + b;
    let count = 0;
    function boom(){
        count = count + 1;
        console.log(a + b + result)
    }
};

console.log(boom(1,2,))

