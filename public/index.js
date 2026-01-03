const register_form = document.getElementById("register_form");

const email = document.getElementById("email");
const password = document.getElementById("password");

register_form.addEventListener("submit", async (event) => {
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
