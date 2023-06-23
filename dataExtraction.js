const t = require("node-tesseract-ocr");
const fs = require("fs");

// ------------------------------------------------
// 	Convert image to text form
// ------------------------------------------------

async function readImg(imgName1, imgName2) {
	return new Promise(async function (resolve, reject) {
		const config = {
			lang: "eng",
			oem: 3,
			psm: 3,
		};

		// ===========================================
		//  face Crop from aadhaar
		// ===========================================

		// coreAPI(imgName1, imgName2, imgName3);
		// ===========================================
		// ===========================================

		//const img = fs.readFileSync(`./uploads/${imgName2}`);
		const img = [`./uploads/${imgName1}`, `./uploads/${imgName2}`];
		//console.log("image---------------------", img);
		var teseString = "nothing";
		var array = [];
		t.recognize(img, config)
			.then((text) => {
				//console.log(text);
				teseString = text;
				// console.log(teseString);
				//conveerting string into arary and removing spaces
				teseString = teseString.replace(/[\r]/gm, "");
				// console.log(teseString);

				array = teseString.split("\n");
				array = array.filter(function (entry) {
					return entry.trim() != "";
				});

				array = array.map((entry) => entry.trim());

				console.log(array);

				// ---------------------------------- extrecting Name from array

				let nameRegEx = /^(([A-Z]{1}[a-z]{1,})+ [A-Z]{1}[a-z]*)$/;
				let dateregex =
					/(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/;

				var findName = "";

				for (let i = 0; i < array.length; i++) {
					if (array[i].match(nameRegEx) && !array[i].match(dateregex)) {
						findName = array[i];
						break;
					}
				}

				//second try

				// var UserName = "";

				// for (let i = 0; i < array.length(); i++) {
				// 	if (array[i].match(nameRegEx)) {
				// 		UserName = array[i];
				// 		break;
				// 	}
				// }
				// console.log(UserName);
				//console.log(findName);

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
				//console.log(userDob);

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

				//console.log(userGender);

				// ---------------------------------- extrecting Aadhaar number from array
				let adharRegEx = /\d{4}\s\d{4}\s\d{4}$/;
				var findAdhar = "";

				for (let i = 0; i < array.length; i++) {
					if (array[i].match(adharRegEx)) {
						findAdhar = array[i];
						break;
					}
				}

				let adharStrictRegEx = /^(\d{4}\s\d{4}\s\d{4})$/;
				var userAdhar = "";
				let end = 13;
				let start = 0;
				while (end < findAdhar.length) {
					for (let i = start; i <= end; i++) {
						userAdhar += findAdhar[i];
					}
					if (userAdhar.match(adharStrictRegEx)) {
						break;
					}
					userAdhar = "";
					start++;
					end++;
				}

				//console.log(userAdhar);

				// -----------------------------------------------extract Address from aadhaar.
				addRegEx = /(Address:)+/i;
				//addCareOfRegEx = /(C\/O|D\/O|S\/O|W\/O)/;
				addEndRegEx = /\d{6}/;

				var findAdress = "";

				// console.log("C/O".match(addCareOfRegEx));

				for (let i = 0; i < array.length; i++) {
					if (array[i].match(addRegEx)) {
						for (let j = i; j < array.length; j++) {
							findAdress += array[j];
							if (array[j].match(addEndRegEx)) {
								break;
							}
						}
					}
				}

				//console.log(findAdress);

				const aadharDetails = {
					name: findName,
					dob: userDob,
					aadharID: userAdhar,
					gender: userGender,
					Address: findAdress,
				};
				resolve(aadharDetails);
				//console.log("result---", aadharDetails);

				return aadharDetails;
			})

			.catch((error) => {
				console.log(error.message);
			});
	});
}

module.exports = readImg;
