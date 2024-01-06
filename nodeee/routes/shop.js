const router = require("express").Router(); //missing parentheses after Router cause error

let connectDB = require("./../database.js");

let db;
connectDB
	.then((client) => {
		console.log("DB연결성공");
		db = client.db("forum");
	})
	.catch((err) => {
		console.log("mongodb connection error" + ":" + err);
	});

// router.get("/shop/shirts", (res, req) => {
// 	res.send("셔츠 파는곳");
// });

// router.get("/shop/pants", (res, req) => {
// 	res.send("바지 파는 페이지");
// });
//  /shop 처럼 중복 되는게 있으면

router.get("/shirts", async (res, req) => {
	await db.collection("post").find().toArray();
	res.send("셔츠 파는곳");
});

router.get("/pants", (res, req) => {
	res.send("바지 파는 페이지");
});

module.exports = router;
