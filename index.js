const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");
const admin = require("./db/admin");
const Employees = require("./db/employees");
const app = express();
const server = require("http").createServer(app);

mongoose.connect("mongodb://localhost/ems", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: false }));

const corsOptions = {
	origin: "http://127.0.0.1:5500",
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
	res.json({
		message: "Api started working",
	});
});

app.post("/adminLogin", (req, res) => {
	const validatedData = new Validator(req.body, {
		email: "required|email",
		password: "required",
	});
	validatedData.check().then(async (matched) => {
		if (!matched) {
			return res.json({ error: Object.values(validatedData.errors) });
		}
		const adminLogin = await admin.findOne({ email: req.body.email });
		if (adminLogin && adminLogin.password === req.body.password) {
			return res.json({
				data: adminLogin,
			});
		}
		return res.json({
			error: {
				message: "Invalid Credentials",
			},
		});
	});
});

app.post("/addEmployee", (req, res) => {
	const validatedData = new Validator(req.body, {
		name: "required|minLength:3|maxLength:50",
		email: "required|email",
		phone: "required|maxLength:11",
	});
	validatedData.check().then((matched) => {
		if (!matched) {
			return res.json({ error: Object.values(validatedData.errors) });
		}
		const emp = new Employees();
		emp.name = req.body.name;
		emp.email = req.body.email;
		emp.phone = req.body.phone;
		emp.save((err) => {
			if (err) {
				console.log(err);
				return res.json({
					error: {
						message: "something went wrong! Usual error is same data entry!",
					},
				});
			} else {
				return res.json({
					data: "new employee added",
				});
			}
		});
	});
});

app.get("/getAllEmployees", async (req, res) => {
	const allEmployee = await Employees.find({});
	if (allEmployee) {
		return res.json(allEmployee);
	}
});

app.get("/getEmployeeData/:empId", async (req, res) => {
	const employee = await Employees.findById(req.params.empId);
	if (employee) {
		return res.json(employee);
	}
});

app.post("/updateEmployee/:empId", async (req, res) => {
	const validatedData = new Validator(req.body, {
		name: "required|minLength:3|maxLength:50",
		email: "required|email",
		phone: "required|maxLength:11",
	});
	validatedData.check().then((matched) => {
		if (!matched) {
			return res.json({ error: Object.values(validatedData.errors) });
		}
	});
	const updatedEmployee = await Employees.findByIdAndUpdate(req.params.empId, {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
	});
	if (updatedEmployee) {
		return res.json(updatedEmployee);
	} else {
		return res.json({
			error: {
				message: "Something went wrong",
			},
		});
	}
});

app.get("/deleteEmployee/:empId", async (req, res) => {
	const data = await Employees.findByIdAndDelete(req.params.empId);
	if (data) {
		return res.json(data);
	} else {
		return res.json({
			error: {
				message: "Something went wrong",
			},
		});
	}
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
