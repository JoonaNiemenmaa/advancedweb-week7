const logout = document.getElementById("logout");

console.log("IM HERE");

logout.addEventListener("click", (event) => {
	localStorage.removeItem("token");
	window.location.replace("/login.html");
});

if (localStorage.token) {
	const url = "http://localhost:3000/api/private";
	const options = {
		method: "GET",
		headers: {
			Authorization: localStorage.token,
		},
	};

	fetch(url, options)
		.then((response) => {
			console.log(response);
			return response.json();
		})
		.then((json) => {
			console.log(json);
		});
} else {
	window.location.replace("/login.html");
}
