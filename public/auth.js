const register = document.getElementById("register");
const login = document.getElementById("login");

const email = document.getElementById("email");
const password = document.getElementById("password");

register.addEventListener("click", async (event) => {
	event.preventDefault();

	const url = "http://localhost:3000/api/user/register";
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email.value,
			password: password.value,
		}),
	};

	const response = await (await fetch(url, options)).json();

	console.log(response);
});

login.addEventListener("click", async (event) => {
	event.preventDefault();

	const url = "http://localhost:3000/api/user/login";
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: email.value,
			password: password.value,
		}),
	};

	const response = await (await fetch(url, options)).json();

	console.log(response);
});
