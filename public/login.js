const login = document.getElementById("loginForm");

const email = document.getElementById("email");
const password = document.getElementById("password");

login.addEventListener("submit", async (event) => {
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

	if (response.success) {
		console.log("login successful");
		localStorage.token = response.token;
		window.location.replace("/");
	} else {
		console.log(`error: ${response.error}`);
	}
});
