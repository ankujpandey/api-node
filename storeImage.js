const data = require("./data");
const person = require("./mongoConnection");
const fs = require("fs");

const saveImage = async (user_id, front_id, back_id, image) => {
	if ((await person.find({ id: user_id })).length == 0) {
		let data = new person({
			id: user_id,
			aadhaar_front: fs
				.readFileSync(`./uploads/${front_id}`)
				.toString("base64"),
			aadhaar_back: fs.readFileSync(`./uploads/${back_id}`).toString("base64"),
			profile_image: fs.readFileSync(`./uploads/${image}`).toString("base64"),
		});

		const result = await data.save();
		console.log("image upload result ------>>>", result);
	} else {
		let data = await person.updateOne(
			{ id: user_id },
			{
				$set: {
					aadhaar_front: fs
						.readFileSync(`./uploads/${front_id}`)
						.toString("base64"),
					aadhaar_back: fs
						.readFileSync(`./uploads/${back_id}`)
						.toString("base64"),
					profile_image: fs
						.readFileSync(`./uploads/${image}`)
						.toString("base64"),
				},
			}
		);
		console.log("image data upload result ------>>>", data);
	}

	fs.unlinkSync(`./uploads/${front_id}`);
	fs.unlinkSync(`./uploads/${back_id}`);
	fs.unlinkSync(`./uploads/${image}`);
};

module.exports = saveImage;
