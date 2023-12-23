const BSONerr = require("bson");
const express = require("express");
const { ObjectId, MongoClient, TopologyDescription } = require("mongodb");
require("dotenv").config();
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //css js jpg (static files)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

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

app.post("/add", async (req, res) => {
	// await db.collection("post").insertOne(req.body);
	await db
		.collection("post")
		.insertOne({ title: req.body.title, content: req.body.content });
	res.redirect("/list");
});

app.get("/list", async (req, res) => {
	let documentResult = await db.collection("post").find().toArray(); //wait till it finishes

	console.log(documentResult);
	res.render("list.ejs", { posts: documentResult });
});

// ":" 다음에 아무문자만 입력 (URL 파라미터)
app.get("/detail/:id", async (req, res) => {
	// _id : new ObjectId("6582d8d7af59763dd065615f");
	try {
		const userID = new ObjectId(req.params.id);
		const result = await db.collection("post").findOne({ _id: userID });
		console.log(result);
		res.render("detail.ejs", { post: result });
	} catch (error) {
		console.log(error);
		res.status(404).send("wrong post id");
	}
});

app.get("/edit/:id", async (req, res) => {
	try {
		const result = await db
			.collection("post")
			.findOne({ _id: new ObjectId(req.params.id) });
		res.render("edit.ejs", { editPost: result });
	} catch (error) {
		console.log(error);

		res.redirect("/list");
	}
});

app.put("/edit/:id", async (req, res) => {
	const result = await db
		.collection("post")
		.updateOne(
			{ _id: new ObjectId(req.params.id) },
			{ $set: { title: req.body.title, content: req.body.content } }
		);
	res.redirect("/list");
});

//how to write a user post function
// write somehting in the page
// title and content sent to server then to db
//saved in db if nothing is wrong

//make edit function
//make link to edit page
//edit stuff title and content
// redirect to list or somwhere
