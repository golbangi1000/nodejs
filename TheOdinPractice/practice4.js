//facotry functions

function createCircle(radius) {
   return {
      radius,
      draw() {
         return "draw";
      },
   };
}

const circle1 = createCircle(8);

console.log(circle1.draw());

console.log(circle1);

function makeSquare(side) {
   return (square = {
      side,
      draw() {
         console.log("draw square");
      },
   });
}
square1 = makeSquare(34);
console.log(square1);
