const express = require("express");

const app = express();

app.get("/LoginV1", (req, res) => {
	try {
		res.status(200).json({
			status: "success",
			data: [],
			message: "Welcome to our API homepage!",
		});
	} catch (err) {
		res.status(500).json({
			status: "error",
			message: "Internal Server error",
		});
	}
});

module.exports = app;
