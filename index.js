const express = require("express");

const otsu = require("otsu");
const t = require("node-tesseract-ocr");
const fs = require("fs");

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

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "./uploads/");
		},
		filename: function (req, file, cb) {
			let filename = file.fieldname + "-" + Date.now() + ".jpg";
			const callback = cb(null, filename);
			req.body.myfilename = filename;

			// console.log("call back---", filename);
		},
	}),
}).single("user_file");

app.post("/uploadImage/:id", upload, async (req, resp) => {
	// console.log(req.file, req.params.id);
	// console.log("myfilename", req.body.myfilename);
	let aadhardetails = await readImg(req.body.myfilename); // calling tesserct here to read image.

	// console.log("Result:", text);
	resp.send(aadhardetails);
	// console.log("print print");
});

// ------------------------------------------------
// 	Convert image to text form
// ------------------------------------------------

function readImg(imgName) {
	const config = {
		lang: "eng",
		oem: 1,
		psm: 3,
	};

	const img = fs.readFileSync(`./uploads/${imgName}`);
	var teseString = "nothing";
	var array = [];
	t.recognize(img, config)
		.then((text) => {
			teseString = text;
			// console.log(teseString);
			//conveerting string into arary and removing spaces
			teseString = teseString.replace(/[\r]/gm, "");
			console.log(teseString);

			array = teseString.split("\n");
			array = array.filter(function (entry) {
				return entry.trim() != "";
			});

			console.log(array);

			//-----------extracting dob from the array
			let dobregex = /DOB/gi;
			var finddob = "";
			for (let i = 0; i < array.length; i++) {
				if (array[i].match(dobregex)) {
					finddob = array[i];
					break;
				}
			}

			// console.log(finddob);
			// return;
			let strictdobregex =
				/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
			let userDob = "";
			let e = 9;
			let s = 0;
			while (e < finddob.length) {
				for (let i = s; i <= e; i++) {
					userDob += finddob[i];
				}
				if (userDob.match(strictdobregex)) {
					break;
				}
				userDob = "";
				s++;
				e++;
			}
			console.log(userDob);

			//-------------------------extrecting gender from array.

			let genderRegEx = /(m|M|male|Male|f|F|female|Female|FEMALE|MALE)$/;
			var findGender = "";

			for (let i = 0; i < array.length; i++) {
				if (array[i].match(genderRegEx)) {
					findGender = array[i];
					break;
				}
			}
			console.log(findGender);

			let strictGenderRegExMale = /^(male|Male|MALE)$/;
			let strictGenderRegExFemale = /^(female|Female|FEMALE)$/;
			let userGender = "";

			console.log(userGender);
		})

		.catch((error) => {
			console.log(error.message);
		});

	// const aadharDetails = {
	// 	name : userName;
	// 	dob : userDob;
	// 	aadharID : aadharNumber;
	// 	gender : userGender;

	// }
	// return aadharDetails;
}

app.listen(4000);
