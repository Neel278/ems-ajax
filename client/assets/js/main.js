const loginFormForAdmin = document.getElementById("loginFormForAdmin");
const formForAddingEmployee = document.getElementById("formForAddingEmployee");
const formForupdatingEmployee = document.getElementById(
	"formForupdatingEmployee"
);
const updateTable = document.getElementById("updateTable");
const empTable = document.getElementById("empTable");
let formAlert = document.getElementById("loginFormAlert");

const serverBase = "http://localhost:3000";

if (loginFormForAdmin) {
	showAlert(false, formAlert);
	loginFormForAdmin.addEventListener("submit", (e) => {
		e.preventDefault();
		$(document).ready(function loginUserFromServer() {
			postCallToServer(
				`adminLogin`,
				makeArgumentsForPostRequestFromSubmittedForm(loginFormForAdmin),
				function dataFromServerForUser(data, status) {
					if (data.error) {
						const errorsDiv = document.getElementById("errorsDiv");
						errorsDiv.innerText = makeErrorString(data.error);
					} else {
						showAlert(false, formAlert);
						localStorage.setItem("loginStatus", true);
						window.location.href = "admin/dashboard.html";
						loginFormForAdmin.removeEventListener(
							"submit",
							loginUserFromServer
						);
					}
				}
			);
		});
	});
}

if (formForAddingEmployee) {
	showAlert(false, formAlert);
	formForAddingEmployee.addEventListener("submit", (e) => {
		e.preventDefault();
		$(document).ready(function addNewEmployee() {
			postCallToServer(
				`addEmployee`,
				makeArgumentsForPostRequestFromSubmittedForm(formForAddingEmployee),
				function responseFromServer(data, status) {
					if (data.error) {
						showErrorOfForm(data.error);
					} else {
						showAlert(false, formAlert);
						alert("Employee added successfully");
						window.location.href = "dashboard.html";
						formForAddingEmployee.removeEventListener("submit", addNewEmployee);
					}
				}
			);
		});
	});
}

if (formForupdatingEmployee) {
	showAlert(false, formAlert);
	const empId = window.location.search.slice("1");
	const name = document.getElementById("name");
	const email = document.getElementById("email");
	const phone = document.getElementById("phone");
	getCallToServer(`getEmployeeData/${empId}`, (data) => {
		name.value = data.name;
		email.value = data.email;
		phone.value = data.phone;
	});
	formForupdatingEmployee.addEventListener("submit", (e) => {
		e.preventDefault();
		$(document).ready(function updateEmployee() {
			postCallToServer(
				`updateEmployee/${empId}`,
				makeArgumentsForPostRequestFromSubmittedForm(formForupdatingEmployee),
				function responseFromServer(data, status) {
					if (data.error) {
						showErrorOfForm(data.error);
					} else {
						showAlert(false, formAlert);
						alert("Employee updated successfully");
						window.location.href = "dashboard.html";
						formForupdatingEmployee.removeEventListener(
							"submit",
							updateEmployee
						);
					}
				}
			);
		});
	});
}

if (updateTable) {
	showEmployeeTable(true);
}
if (empTable) {
	showEmployeeTable(false);
}

function logoutUser() {
	localStorage.removeItem("loginStatus");
	window.location.href = "../index.html";
}

function showEmployeeTable(withPowers) {
	showAlert(false, formAlert);

	getCallToServer("getAllEmployees", (employees) => {
		for (let employee of Object.values(employees)) {
			addNewRow(employee, withPowers);
		}
	});
}

function addNewRow(employee, withPowers) {
	const trEl = document.createElement("tr");
	if (withPowers) {
		trEl.innerHTML = `
		<td>${employee.name}</td>
		<td>${employee.email}</td>
		<td>${employee.phone}</td>
		<td>
			<a href="updatingEmployee.html?${employee._id}" type="button" class="btn btn-warning btn-sm">Edit</a>
			<a href="#" type="button" class="btn btn-danger btn-sm" onclick="deleteEmployee('${employee._id}')" >Delete</a>
		</td>
	`;
		updateTable.appendChild(trEl);
	} else {
		trEl.innerHTML = `
		<td>${employee.name}</td>
		<td>${employee.email}</td>
		<td>${employee.phone}</td>
	`;
		empTable.appendChild(trEl);
	}
}

function deleteEmployee(empId) {
	getCallToServer(`deleteEmployee/${empId}`, (data) => {
		if (data.error) {
			showErrorOfForm(data.error);
			// console.log(data.error);
		} else {
			showAlert(false, formAlert);
			alert("Employee deleted successfully");
			window.location.href = "dashboard.html";
		}
	});
}

function showErrorOfForm(errorsObj) {
	const errorsDiv = document.getElementById("errorsDiv");
	errorsDiv.innerText = makeErrorString(errorsObj);
}

function makeArgumentsForPostRequestFromSubmittedForm(form) {
	const tempObj = {};
	for (let input of form.getElementsByTagName("input")) {
		tempObj[input.name] = input.value;
	}
	return tempObj;
}

function getValueOfElementWithIdOf(id) {
	return document.getElementById(id).value;
}

function postCallToServer(path, data, callback) {
	$.post(`${serverBase}/${path}`, data, callback);
}
function getCallToServer(path, callback) {
	$.get(`${serverBase}/${path}`, callback);
}

function makeErrorString(errors) {
	const errorsArr = errors instanceof Array ? errors : [errors];
	let errorString = "";
	showAlert(true, formAlert);
	for (let error of errorsArr) {
		errorString += `${error.message}\n`;
	}
	return errorString;
}

function showAlert(flag, alertEl) {
	if (flag) {
		alertEl.style.display = "block";
	} else {
		alertEl.style.display = "none";
	}
}
