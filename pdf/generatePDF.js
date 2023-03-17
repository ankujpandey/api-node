const puppeteer = require("puppeteer");
const fs = require("fs");
const pdfTemplate = require("./pdfTemplate");
const person = require("/home/ankujpandey/node-test/mongoConnection"); //store image in mongo.
const con = require("/home/ankujpandey/node-test/dbConnect.js");

function accessImage(user_id) {
	return new Promise(function (resolve, reject) {
		let data = person.find({ id: user_id }).lean();
		resolve(data);
		return data;
	});
}

function accessData(id) {
	return new Promise(function (resolve, reject) {
		con.query(`SELECT * FROM person WHERE id=${id}`, async (error, result) => {
			if (error) {
				error;
			} else {
				resolve(result);
				return result;
			}
		});
	});
}

const createPDF = async (id) => {
	console.log("id-------", id);

	let res = await accessData(id);
	let imgRes = await accessImage(id);

	console.log("result------------->>>>>>>>>", imgRes[0]);
	// Create a browser instance
	const browser = await puppeteer.launch();

	// Create a new page
	const page = await browser.newPage();

	//Get HTML content from HTML file
	// const html = fs.readFileSync("./pdf/pdfTemplate.html", "utf-8");

	const html = await pdfTemplate(res[0], imgRes[0]);
	await page.setContent(html, { waitUntil: "domcontentloaded" });

	// To reflect CSS used for screens instead of print
	await page.emulateMediaType("screen");

	// Downlaod the PDF
	const pdf = await page.pdf({
		path: "./pdf/result.pdf",
		margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
		printBackground: true,
		format: "A4",
	});

	// Close the browser instance
	await browser.close();
};

module.exports = createPDF;
