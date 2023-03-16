const IDAnalyzer = require("idanalyzer");
const con = require("./dbConnect");
// const storeImage = require("./mongoConnection");
const saveImage = require("./storeImage");
const fs = require("fs");

let CoreAPI = new IDAnalyzer.CoreAPI("INELU2ibe1HozTTaMBqWsVLHvTJYlsB3", "US");

// Analyze ID image by passing URL of the ID image (you may also use a local file)
function idScan(primary_img, secondary_img, biometric_img, id) {
	con.query(`SELECT * FROM person WHERE id = ${id}`, (error, result) => {
		if (error) {
			console.log(error);
		} else {
			console.log(result[0].id);

			// Enable authentication module v2 to check if ID is authentic
			CoreAPI.enableAuthentication(true, 2);

			CoreAPI.enableDualsideCheck(true);

			CoreAPI.verifyName(`${result[0].name}`);

			// CoreAPI.verifyDOB("1990/01/01");

			CoreAPI.verifyDocumentNumber(`${result[0].adhar}`);

			CoreAPI.scan({
				document_primary: `./uploads/${primary_img}`,
				document_secondary: `./uploads/${secondary_img}`,
				biometric_photo: `./uploads/${biometric_img}`,
			})
				.then(function (response) {
					if (!response.error) {
						console.log(response);
						// All the information about this ID will be returned in an associative array
						let data_result = response["result"];
						let authentication_result = response["authentication"];
						let verification_data = response["verification"];
						let face_result = response["face"];

						if (
							verification_data.result.name === false ||
							verification_data.result.documentNumber === false
						) {
							console.log("Wrong data");

							fs.unlinkSync(`./uploads/${primary_img}`);
							fs.unlinkSync(`./uploads/${secondary_img}`);
							fs.unlinkSync(`./uploads/${biometric_img}`);
						} else {
							// Print result
							console.log(`Hello your name is ${data_result["fullName"]}`);

							// Parse document authentication results
							if (authentication_result) {
								if (authentication_result["score"] > 0.5) {
									console.log("The document uploaded is authentic");
								} else if (authentication_result["score"] > 0.3) {
									console.log(
										"The document uploaded looks little bit suspicious"
									);
								} else {
									console.log("The document uploaded is fake");
								}
							}
							// Parse biometric verification results
							if (face_result) {
								if (face_result["isIdentical"]) {
									console.log("Biometric verification PASSED!");
								} else {
									console.log("Biometric verification FAILED!");
								}
								console.log("Confidence Score: " + face_result["confidence"]);
							}

							// --------------------------------------------------
							// Saving the data in mongo
							// --------------------------------------------------

							saveImage(id, primary_img, secondary_img, biometric_img);
						}
					} else {
						// API returned an error
						console.log(response.error);
					}
				})
				.catch(function (err) {
					console.log(err.message);
				});
		}
	});
}

module.exports = idScan;
