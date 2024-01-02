const BSONerr = require("bson");
const express = require("express");
const { ObjectId, MongoClient, TopologyDescription } = require("mongodb");
require("dotenv").config();
const app = express();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(passport.initialize());
app.use(
	session({
		secret: "암호화에 쓸 비번",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60 * 1000 },
	})
);

app.use(passport.session());

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

	res.render("list.ejs", { posts: documentResult });
});

// ":" 다음에 아무문자만 입력 (URL 파라미터)
app.get("/detail/:id", async (req, res) => {
	// _id : new ObjectId("6582d8d7af59763dd065615f");
	try {
		const userID = new ObjectId(req.params.id);
		const result = await db.collection("post").findOne({ _id: userID });
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

app.delete("/delete/:id", async (req, res) => {
	console.log(req.params.id);
	const result = db
		.collection("post")
		.deleteOne({ _id: new ObjectId(req.params.id) });
	res.send("삭제완료");
});

// ============ use skip but it can be slow =============
app.get("/list/:number", async (req, res) => {
	let documentResult = await db
		.collection("post")
		.find()
		.skip((req.params.number - 1) * 5)
		.limit(5)
		.toArray(); //wait till it finishes

	res.render("list.ejs", { posts: documentResult });
});

app.get("/list/next/:number", async (req, res) => {
	let documentResult = await db
		.collection("post")
		.find({ _id: { $gt: new ObjectId(req.params.number) } })
		.limit(5)
		.toArray(); //wait till it finishes

	res.render("list.ejs", { posts: documentResult });
});

passport.use(
	new LocalStrategy(async (username1, password1, cb) => {
		let result = await db.collection("user").findOne({ username: username1 });
		if (!result) {
			return cb(null, false, { message: "아이디 DB에 없음" });
		}
		if (result.password == password1) {
			return cb(null, result);
		} else {
			return cb(null, false, { message: "비번불일치" });
		}
	})
);

//serializeUser
passport.serializeUser((user, done) => {
	console.log(user);
	process.nextTick(() => {
		done(null, { id: user._id, username: user.username });
	});
});

passport.deserializeUser(async (user, done) => {
	let result = await db
		.collection("user")
		.findOne({ _id: new ObjectId(user.id) });
	delete result.password;
	process.nextTick(() => {
		done(null, result);
	});
});

app.get("/login", async (req, res) => {
	console.log(req.user);
	res.render("login.ejs");
});

app.post("/login", async (req, res, next) => {
	passport.authenticate("local", (error, user, info) => {
		if (error) {
			return res.status(500).json(error + "에러");
		}
		if (!user) {
			return res.status(400).json(info.message + "!user일떄");
		}

		req.login(user, (err) => {
			if (err) {
				return next(err);
			}
			res.redirect("/");
		});
	})(req, res, next);
});

app.get("/mypage", (req, res) => {
	try {
		if (!req.user) {
			res.write("<script>alert('login please')</script>");
			res.write('<script>window.location="/list"</script>');
		} else {
			res.render("mypage.ejs");
		}
	} catch (error) {
		console.log(error);
	}
});

//how to write a user post function
// write somehting in the page
// title and content sent to server then to db
//saved in db if nothing is wrong

//make edit function
//make link to edit page
//edit stuff title and content
// redirect to list or somwhere
