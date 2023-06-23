// const { string } = require("@tensorflow/tfjs-node");
const mongoose = require("mongoose");

mongoose
	.connect("mongodb://127.0.0.1:27017/userData")
	.then(() => console.log("mongo Connected!"));

const personSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	aadhaar_front: String,
	aadhaar_back: String,
	profile_image: String,
});

const person = mongoose.model("person", personSchema, "person");

module.exports = person;
