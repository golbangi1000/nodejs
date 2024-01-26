const BSONerr = require("bson");
const express = require("express");
const { ObjectId, MongoClient, TopologyDescription } = require("mongodb");
require("dotenv").config();
const app = express();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const bcrypt = require("bcrypt");
const mongoStore = require("connect-mongo");

//socket io
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server);

const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new S3Client({
	region: "ap-northeast-2",
	credentials: {
		accessKeyId: process.env.S3_KEY,
		secretAccessKey: process.env.S3_SECRET,
	},
});

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: "awsnodebucket1",
		key: function (요청, file, cb) {
			cb(null, Date.now().toString()); //업로드시 파일명 변경가능
		},
	}),
});

const MONGO_URL = process.env.MONGO_URL;
const PORT1 = process.env.PORT;
const PORT = parseFloat(PORT1);

app.use(passport.initialize());
app.use(
	session({
		secret: "암호화에 쓸 비번",
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 60 * 1000 }, //look up connect-mongo for session related stuff
		store: mongoStore.create({
			mongoUrl: MONGO_URL,
			dbName: "forum",
		}),
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

let connectDB = require("./database.js");
let db;

connectDB
	.then((client) => {
		console.log("DB연결성공");

		db = client.db("forum");
		server.listen(PORT, () => {
			console.log(8080 + "서버 실행중");
		});
	})
	.catch((err) => {
		console.log("mongodb connection error" + ":" + err);
	});

function loginPlz(req, res, next) {
	if (!req.user) {
		res.send("로그인하세요");
	}
	next(); //
}

// app.use(loginPlz); //이거 밑에 있는 API들은 loginPlz가 적용됨 이렇게하면

app.get("/", loginPlz, (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/game", (req, res) => {
	res.sendFile(__dirname + "/game.html");
});

app.get("/write", (req, res) => {
	res.render("write.ejs");
});

app.post("/add", async (req, res) => {
	//when uploding multiple images gotta use array instead of single
	// Ex. upload('img1', "number of images")

	upload.single("img1")(req, res, async (error) => {
		if (error) {
			return res.send("img upload error");
		}
		try {
			console.log(req.file);

			if (req.body.title == "") {
				res.send("title is empty");
			} else {
				await db.collection("post").insertOne({
					title: req.body.title,
					content: req.body.content,
					img: req.file ? req.file.location : "", // 조건식 ? 참일떄 : 거짓일때
					user: req.user._id,
					username: req.user.username,
				});
				res.redirect("/list");
			}
		} catch (error) {
			console.log(error);
			res.status(500).send("error!!!");
		}
	});
});

function dateConsole(req, res, next) {
	///////middleware =========================================
	console.log(new Date());
	next();
}

app.get("/list", dateConsole, async (req, res) => {
	let documentResult = await db.collection("post").find().toArray(); //wait till it finishes

	res.render("list.ejs", { posts: documentResult });
});

// ":" 다음에 아무문자만 입력 (URL 파라미터)
app.get("/detail/:id", async (req, res) => {
	// _id : new ObjectId("6582d8d7af59763dd065615f");
	try {
		const userID = new ObjectId(req.params.id);
		const result = await db.collection("post").findOne({ _id: userID });

		const result2 = await db
			.collection("comments")
			.find({ postID: new ObjectId(req.params.id) })
			.toArray();
		console.log(result2);
		res.render("detail.ejs", { post: result, result2: result2 });
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
	const result = db.collection("post").deleteOne({
		_id: new ObjectId(req.params.id),
		user: new ObjectId(req.user._id),
	});
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
	new LocalStrategy(async (usernameInput, passwordInput, cb) => {
		let result = await db
			.collection("user")
			.findOne({ username: usernameInput });
		if (!result) {
			return cb(null, false, { message: "아이디 DB에 없음" });
		}

		await bcrypt.compare(passwordInput, result.password);
		if (result.password == passwordInput) {
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
	res.render("login.ejs");
});

function checkEmptyInput(req, res, next) {
	let username = req.body.username;
	let password = req.body.password;
	if (username == null || username.length === 0) {
		res.write("<script>alert('please type something in username')</script>");
		res.write('<script>window.location="/list"</script>');
		return res.end();
	} else {
		next();
	}
}

app.post("/login", checkEmptyInput, async (req, res, next) => {
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
			return res.end();
		} else {
			console.log(req.user);
			res.render("mypage.ejs", { userInfo: req.user });
		}
	} catch (error) {
		console.log(error);
	}
});

app.get("/register", (req, res) => {
	res.render("register.ejs");
});

app.post("/register", async (req, res) => {
	let hashResult = await bcrypt.hash(req.body.password, 11);
	console.log(hashResult);

	await db
		.collection("user")
		.insertOne({ username: req.body.username, password: hashResult });

	res.render("register.ejs");
});
//how to write a user post function
// write somehting in the page
// title and content sent to server then to db
//saved in db if nothing is wrong

//make edit function
//make link to edit page
//edit stuff title and content
// redirect to list or somwhere

// require("./routes/shop.js");
// app.use("/", require("./routes/shop.js")); shop.js에 shop을 써놨을떄
app.use("/shop", require("./routes/shop.js"));

app.get("/search", async (req, res) => {
	let searchConditions = [
		{
			$search: {
				index: "default1234",
				autocomplete: {
					path: "title",
					query: req.query.val,
					tokenOrder: "any",
					fuzzy: {
						maxEdits: 2,
						prefixLength: 1,
						maxExpansions: 256,
					},
				},
				highlight: {
					path: "title",
				},
			},
		},
	];

	let documentResult = await db
		.collection("post")
		.aggregate(searchConditions)
		.toArray();

	res.render("search.ejs", { posts: documentResult });
});

/**
 * how does search index work
 */

// ===comment===

app.post("/comment", async (req, res) => {
	await db.collection("comments").insertOne({
		comment: req.body.comment,
		writerID: new ObjectId(req.user._id),
		writerUsername: req.user.username,
		postID: new ObjectId(req.body.parentId),
	});

	res.redirect("back");
});

app.get("/chat/request", async (req, res) => {
	await db.collection("chatroom").insertOne({
		member: [req.user._id, new ObjectId(req.query.writerID)],
		date: new Date(),
	});

	res.redirect("/chat/list");
});

app.get("/chat/list", async (req, res) => {
	let result1 = await db
		.collection("chatroom")
		.find({ member: new ObjectId(req.user._id) }) //if user is not logged in it cna't find the result1
		.toArray();

	res.render("chatlist.ejs", { result: result1 });
});

app.get("/chat/detail/:id", async (req, res) => {
	//only
	const result = await db
		.collection("chatroom")
		.findOne({ _id: new ObjectId(req.params.id) });

	// console.log(result); JSON format
	// handtyped url
	console.log(result.member[0] + "콘솔");
	if (!req.user || !req.user._id) {
		console.log("redirected a user because it was guest");
		res.write('<script>window.location="/list"</script>');
		return res.end();
	}
	if (
		result.member[0].equals(req.user._id) ||
		result.member[1].equals(req.user._id)
	) {
		res.render("chatDetail.ejs", { result: result });
	} else {
		res.redirect("/list");
	}
});

io.on("connection", (socket) => {
	console.log("somebody connected to websocket");

	socket.on("age", (data) => {
		console.log("유저가 보낸것", data); //event listner
		io.emit("name", "bobby"); //서버가 모든유저한테 보낼때
	});

	// socket.join('룸이름') 유저를 룸에 넣는건 서버만 가능
	socket.on("ask-join", (data) => {
		socket.join(data);
	});

	socket.on("message", (data) => {
		io.to(data.room).emit("broadcast", data.msg);
	});
});
