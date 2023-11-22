const circle = {
   radius: 12,
   draw: function () {
      console.log("draw");
   },
};

// const another = {};

// for (let key in circle) {
//    another[key] = circle[key];
// }

// another["radius"] = circle["radius"];
// console.log(another.draw);

// const another = Object.assign({ color: "yellow" }, circle); // get all stuff in circle to the object on the left

const another = { ...circle }; //takes all the properties and methods in the object best way to clone an object

console.log(another);

console.log("-=========================");

//Math
