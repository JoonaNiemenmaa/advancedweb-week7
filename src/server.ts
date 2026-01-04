import router from "./router";
import express from "express";

const port: number = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(router);

app.listen(port, () => {
	console.log(`Web app listening on port ${port}`);
});
