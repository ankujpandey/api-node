const puppeteer = require("puppeteer");
const fs = require("fs");
const pdfTemplate = require("./pdfTemplate");

const createPDF = async (id) => {
	console.log("id-------", id);
	// Create a browser instance
	const browser = await puppeteer.launch();

	// Create a new page
	const page = await browser.newPage();

	//Get HTML content from HTML file
	// const html = fs.readFileSync("./pdf/pdfTemplate.html", "utf-8");

	const html = pdfTemplate(id);
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
