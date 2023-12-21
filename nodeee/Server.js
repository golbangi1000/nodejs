const express = require("express");
const { mongoClient, MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //css js jpg (static files)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/game", (req, res) => {
	res.sendFile(__dirname + "/game.html");
});

app.get("/write", (req, res) => {
	res.render("write.ejs");
});

app.post("/add", (req, res) => {
	console.log(req.body);
	console.log(typeof req.body);
	db.collection("post").insertOne(req.body);
});

app.get("/list", async (req, res) => {
	let documentResult = await db.collection("post").find().toArray(); //wait till it finishes

	console.log(documentResult);
	res.render("list.ejs", { posts: documentResult });
});

//how to write a user post function
// write somehting in the page
// title and content sent to server then to db
//saved in db if nothing is wrong
