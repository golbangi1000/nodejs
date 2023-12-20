const express = require("express");
const { mongoClient, MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.static(__dirname + "/public")); //css js jpg (static files)

const MONGO_URL = process.env.MONGO_URL;
const PORT1 = process.env.PORT;
const PORT = parseFloat(PORT1);

let db;
const url = MONGO_URL;
new MongoClient(url)
	.connect()
	.then((client) => {
		console.log("DB연결성공");
		db = client.db("forum");
	})
	.catch((err) => {
		console.log("mongodb connection error" + ":" + err);
	});

app.listen(PORT, () => {
	console.log(8080 + "서버 실행중");
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/hello", (req, res) => {
	res.send("boomboom");
});

app.get("/game", (req, res) => {
	res.sendFile(__dirname + "/game.html");
});

app.get("/newbook", (req, res) => {
	db.collection("post").insertOne({ title: "book1234" });
});

app.get("/list", async (req, res) => {
	let documentResult = await db.collection("post").find().toArray(); //wait till it finishes

	console.log(documentResult);
	res.send("DB document에 있던것들");
});
