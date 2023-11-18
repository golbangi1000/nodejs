//one thing to understand about objects are that they are dynamic
const circle = {
   radius: 1,
};

circle.color = "blue";
circle.draw = function () {
   console.log("draw");
};
console.log(circle);

delete circle.color;
console.log(circle);
