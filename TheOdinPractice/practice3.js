const array1 = [1, 2, 3, 4, 5, 6, "", null, undefined, NaN, 0, false];

function count(array) {
   let count = 0;
   for (let value of array) {
      //if truthy just count++; don't have to compare to all falsy
      if (value) {
         count++;
      }
   }
   return count;
}

console.log(count(array1));
console.log("================================================");

function fizzbuzz(number) {
   if (typeof number !== "number") {
      return "not a number";
   }

   if (number % 3 === 0 && number % 5 === 0) {
      return "fizzbuzz";
   } else if (number % 3 === 0) {
      return "fizz";
   } else if (number % 5 === 0) {
      return "buzz";
   } else {
      return number;
   }
}

console.log(fizzbuzz("awef"));

const movie = {
   title: "a",
   releaseYear: 2018,
   rating: 4.5,
   director: "b",
};
console.log("-----------------------------------");
for (let value in movie) {
   console.log(value);
}
// for(let value of movie){
//     console.log(value)
// }

console.log("-----------------------------------");
for (let value in movie) {
   if (typeof movie[value] === "string") {
      console.log(value + "   " + movie[value]);
   }
}
console.log("----------------------------------------------------------------------");

number = 2;
for (i = 1; i < number; i++) {
   console.log(i);
}
