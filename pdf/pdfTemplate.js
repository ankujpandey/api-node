// const person = require("./mongoConnection"); //store image in mongo.
const con = require("/home/ankujpandey/node-test/dbConnect.js");

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

async function createTemplate(id) {
	// let res = await accessData(id);

	// console.log("result------------->>>>>>>>>", res[0].name);

	return `<!DOCTYPE html>
	<html>
		<head>
			<title>HTML content</title>
		</head>
		<body>
			<h1>Sample</h1>
			<div>
			
				<p></p>
				<ul>
					<li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
					<li>
						Integer interdum felis nec orci mattis, ac dignissim mauris commodo.
					</li>
				</ul>
				<p></p>
				<p></p>
				<ul>
					<li>In et augue non turpis faucibus tincidunt a et lectus.</li>
					<li>
						Nulla congue nisi vel diam hendrerit, at pulvinar massa aliquam.
					</li>
				</ul>
				<p></p>
			</div>
	
			<h1>Ipsum Paragraphs</h1>
			<div>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit
					amet magna turpis. Donec a tellus in mi pharetra volutpat at et nulla.
					Aenean porttitor fringilla diam et pretium. Fusce id velit mauris.
					Aenean ultrices orci dolor, sed tristique eros molestie eget. Fusce non
					ultrices odio. Sed nisi ex, porttitor non fermentum eu, rutrum quis
					mauris. Morbi scelerisque sollicitudin semper. Nunc vitae pharetra
					tortor, vel gravida ante. Integer euismod velit nisi, quis sollicitudin
					neque dictum nec. Morbi magna nulla, scelerisque a malesuada at,
					scelerisque at quam. Aliquam sit amet lorem congue, pellentesque metus
					non, aliquet purus. Integer a metus augue. Ut venenatis cursus ante, sed
					venenatis quam consequat id. Fusce rhoncus elementum felis, eu volutpat
					magna lacinia id. Proin ac sagittis nulla, a molestie turpis.
				</p>
				<p>
					Praesent sagittis leo ac congue faucibus. Phasellus pellentesque
					faucibus nisl fringilla pharetra. Morbi iaculis mollis viverra. Etiam
					eget lectus ac eros finibus cursus. Sed sed odio ac nisi semper tempus.
					Nam semper congue dui quis dictum. Nullam molestie vehicula mi, ac
					faucibus augue cursus vitae. Praesent orci lectus, tempor non enim a,
					accumsan volutpat mi. Donec tempus faucibus nisi quis mollis. Duis
					vestibulum risus id purus dignissim, euismod tristique libero volutpat.
				</p>
			</div>
		</body>
	</html>`;
}

module.exports = createTemplate;
