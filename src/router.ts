import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "secret";
const BCRYPT_ITERATIONS = 10;

const router = Router();

type TUser = {
	email: string;
	password: string;
};

const users: TUser[] = [];

function findUser(email: string): TUser | null {
	for (const user of users) {
		if (user.email === email) {
			return user;
		}
	}
	return null;
}

router.post("/api/user/register", (request: Request, response: Response) => {
	const email: string = request.body.email;
	const password: string = request.body.password;

	if (!(email && password)) {
		response.status(400);
		response.json({
			error: "please supply an email and password",
		});
		return;
	}

	const existing_user = findUser(email);

	if (existing_user) {
		response.status(403);
		response.json({
			error: `email '${email} already in use'`,
		});
		return;
	}

	const salt = bcrypt.genSaltSync(BCRYPT_ITERATIONS);
	const hash = bcrypt.hashSync(password, salt);

	const user: TUser = {
		email: email,
		password: hash,
	};

	users.push(user);

	response.status(200);
	response.json(user);
});

router.post("/api/user/login", (request: Request, response: Response) => {
	const email: string = request.body.email;
	const password: string = request.body.password;

	if (!(email && password)) {
		response.status(400);
		response.json({
			success: false,
			error: "please supply an email and password",
		});
		return;
	}

	const user = findUser(email);

	if (!user) {
		response.status(404);
		response.json({
			success: false,
			error: "could not find user",
		});
		return;
	}

	if (!bcrypt.compareSync(password, user.password)) {
		response.status(400);
		response.json({
			success: false,
			error: "incorrect password",
		});
		return;
	}

	const payload = {
		email: email,
	};

	const token = jwt.sign(payload, SECRET);
	response.json({ success: true, token: token });
});

router.get("/api/user/list", (request: Request, response: Response) => {
	response.json(users);
});

export default router;
