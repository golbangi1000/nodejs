function Circle(radius) {
   //this refers to the object that is executing the code
   this.radius = radius;
   this.draw = function () {
      console.log("draw");
   };

   return this; //don't have to put it explicitly.
}

const circle = new Circle(3);
//create a new empty object
// this
