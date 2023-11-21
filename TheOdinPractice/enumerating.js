const circle = {
   radius: 12,
   draw: function () {
      console.log("draw");
   },
};

for (key in circle) {
   console.log(key, circle[key]);
}

//for of only work on iterables like arrays and maps,but using these work
console.log("==============");
for (key of Object.keys(circle)) {
   console.log(key);
}
for (entry of Object.entries(circle)) {
   console.log(entry);
}

// use in for if statement to check what key is in the object like

if ("radius" in circle) {
   console.log("yes");
}
if ("radiuaasdfs" in circle) {
   console.log("yes");
} else {
   console.log("no");
}

//========================================================
