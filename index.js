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
}).array("user_file", 2);

app.post("/uploadImage/:id", upload, async (req, resp) => {
	// console.log(req.file, req.params.id);
	console.log("myfilename", req.body.myfilename);
	imageFiles = [];
	let aadhardetails = await readImg(
		req.body.myfilename[0],
		req.body.myfilename[1]
	); // calling tesserct here to read image.

	// console.log("Result:", text);
	resp.send(aadhardetails);
	// console.log("print print");
	// resp.send("uploaded");
});

// ------------------------------------------------
// 	Convert image to text form
// ------------------------------------------------

async function readImg(imgName1, imgName2) {
	const config = {
		lang: "eng",
		oem: 1,
		psm: 3,
	};

	//const img = fs.readFileSync(`./uploads/${imgName2}`);
	const img = [`./uploads/${imgName1}`, `./uploads/${imgName2}`];
	console.log("image---------------------", img);
	var teseString = "nothing";
	var array = [];
	t.recognize(img, config)
		.then((text) => {
			console.log(text);
			teseString = text;
			// console.log(teseString);
			//conveerting string into arary and removing spaces
			teseString = teseString.replace(/[\r]/gm, "");
			// console.log(teseString);

			array = teseString.split("\n");
			array = array.filter(function (entry) {
				return entry.trim() != "";
			});

			console.log(array);

			// ---------------------------------- extrecting Name from array

			let nameRegEx = /[a-zA-Z]/;
			let dateregex =
				/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

			let findName = "";

			for (let i = 0; i < array.length; i++) {
				if (array[i].match(nameRegEx) && !array[i].match(dateregex)) {
					findName = array[i];
					break;
				}
			}

			console.log(findName);

			//-----------extracting dob from the array
			let dobregex = /DOB/gi;
			let finddob = "";
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
			var userDob = "";
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

			let genderRegEx = /(male|Male|female|Female|FEMALE|MALE)$/;
			let findGender = "";

			for (let i = 0; i < array.length; i++) {
				if (array[i].match(genderRegEx)) {
					findGender = array[i];
					break;
				}
			}
			// console.log(findGender);

			// let strictGenderRegExMale = /(male|Male|MALE)$/;
			let strictGenderRegExFemale = /(female|Female|FEMALE)$/;
			var userGender = "";

			if (findGender.match(strictGenderRegExFemale)) {
				userGender += "FEMALE";
			} else {
				userGender += "MALE";
			}

			console.log(userGender);

			// ---------------------------------- extrecting Aadhaar number from array
			let adharRegEx = /\d{4}\s\d{4}\s\d{4}$/;
			var findAdhar = "";

			for (let i = 0; i < array.length; i++) {
				if (array[i].match(adharRegEx)) {
					findAdhar = array[i];
					break;
				}
			}

			console.log(findAdhar);
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
