function Circle(radius) {
   //this refers to the object that is executing the code
   this.radius = radius;
   this.draw = function () {
      console.log("draw");
   };

   return this; //don't have to put it explicitly.
}

//create a new empty object
// this

Circle.call({}, 1);
Circle.apply({}, [1, 2, 3]);

circle1 = new Circle1(1);
console.log(circle1);
