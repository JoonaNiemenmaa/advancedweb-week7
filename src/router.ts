import { Router } from "express";

const router = Router();

router.get("/hello", (request, response) => {
	response.send("Hello user!");
});

export default router;
