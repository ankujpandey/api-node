const express = require("express");

const coreAPI = require("./idAnalyser"); // calling id analyzer

const readImg = require("./dataExtraction"); //calling tesseract file tp extract data.

const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const app = express();
const con = require("./dbConnect");
const cors = require("cors");
app.use(express.json());
app.use(cors());

// // ----------------------------------
// // Get Api
// // ----------------------------------

// app.get("/", (req, resp) => {
// 	// resp.send("route done");
// 	con.query("select * from person", (error, result) => {
// 		if (error) {
// 			resp.send("error");
// 		} else {
// 			resp.send(result);
// 		}
// 	});
// });

// ----------------------------------
// Get Api Pagination
// ----------------------------------

app.get("/", (req, resp) => {
	//console.log(req.query);
	let len;
	con.query("SELECT COUNT(*) as length From person", (error, result) => {
		len = result;
	});
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 2;
	let reqObj = {};
	const skip = (page - 1) * limit;

	con.query(
		`SELECT * FROM person LIMIT ${limit} OFFSET ${skip}`,
		(error, result) => {
			if (error) {
				// resp.send("error");
				console.log(error.message);
			} else {
				reqObj.result = result;
				reqObj.length = len;
				resp.send(reqObj);
			}
		}
	);
});

// get by id

app.get("/:id", (req, resp) => {
	const data = req.body;
	con.query(
		`SELECT * FROM person WHERE id=${req.params.id}`,
		(error, result) => {
			if (error) {
				resp.send("error");
			} else {
				resp.send(result);
			}
		}
	);
});

// ----------------------------------
// Post Api
// ----------------------------------

app.post("/", (req, resp) => {
	const data = req.body;
	console.log(data);
	con.query("INSERT INTO person SET ?", [data], (error, result, fields) => {
		if (error) {
			console.log(error);
		}
		resp.send(result);
	});
});

// ----------------------------------
// Put Api
// ----------------------------------

app.put("/:id", (req, resp) => {
	const data = [req.body.name, req.body.mobile, req.body.pan, req.params.id];
	con.query(
		"UPDATE person SET name = ?, mobile =?, pan = ? WHERE id = ?",
		data,
		(error, result, fields) => {
			if (error) error;
			resp.send(result);
		}
	);
});

// ----------------------------------
// delete Api
// ----------------------------------

app.delete("/:id", (req, resp) => {
	con.query(
		`DELETE FROM person WHERE id = ${req.params.id}`,
		(error, result) => {
			if (error) error;
			resp.send(result);
		}
	);
});

// -------------------------------------------
// 	upload image
// -------------------------------------------
var imageFiles = [];
const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "./uploads/");
		},
		filename: function (req, file, cb) {
			// console.log("bodyyyyy===>", file);
			let filename = file.fieldname + "-" + Date.now() + ".jpg";
			const callback = cb(null, filename);

			imageFiles = [...imageFiles, filename];
			req.body.myfilename = imageFiles;
			// console.log("call back---", filename);
		},
	}),
}).array("user_file", 3);

app.post("/uploadImage/:id", upload, async (req, resp) => {
	// console.log(req.file, req.params.id);
	console.log("myfilename", req.body.myfilename);
	imageFiles = [];
	let aadhardetails = await readImg(
		req.body.myfilename[0],
		req.body.myfilename[1]
	); // calling tesserct here to read image.

	console.log("aadhhaar", aadhardetails);

	console.log(req.params.id);
	await coreAPI(
		req.body.myfilename[0],
		req.body.myfilename[1],
		req.body.myfilename[2],
		req.params.id
	);
	// console.log("Result:", text);
	resp.send(aadhardetails);
	// console.log("print print");
	// resp.send("uploaded");
});

app.listen(4000);
