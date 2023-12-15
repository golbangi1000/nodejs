const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public")); //css js jpg (static files)

app.listen(8080, () => {
   console.log("8080서버 실행중");
});

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/index.html");
});

app.get("/hello", (req, res) => {
   res.send("boomboom");
});

app.get("/shop", (req, res) => {
   res.send("shop");
});
