const breakfasts = ["bacon", "eggs", "oatmeal", "toast", "cereal"];
const order = "Let me get some bacon and eggs, please";


breakfasts.find.apply()

console.log(order.match(new RegExp(`(${breakfasts.join("|")})`, "g")))