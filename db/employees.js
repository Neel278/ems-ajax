const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	phone: {
		type: String,
		required: true,
		unique: true,
	},
});

module.exports = mongoose.model("employees", employeeSchema);
