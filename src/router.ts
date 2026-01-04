import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET: string | undefined = process.env.SECRET;
const BCRYPT_ITERATIONS = 10;

interface IPayload extends JwtPayload {
	email: string;
}

const validate = (request: Request, response: Response, next: Function) => {
	const authorization: string | undefined = request.headers.authorization;

	if (!authorization) {
		return response
			.status(400)
			.json({ message: "no authorization header" });
	}

	if (!SECRET) {
		return response.status(500).json({ message: "internal server error" });
	}

	let payload: IPayload;
	try {
		payload = jwt.verify(authorization, SECRET) as IPayload;
	} catch (err) {
		return response.status(401).json({ message: "invalid token" });
	}

	if (!findUser(payload.email)) {
		return response.status(404).json({ message: "no such user" });
	}

	next();
};

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

	if (SECRET) {
		const token = jwt.sign(payload, SECRET);
		response.json({ success: true, token: token });
	} else {
		return response
			.status(500)
			.json({ success: false, error: "internal server error" });
	}
});

router.get("/api/user/list", (request: Request, response: Response) => {
	response.json(users);
});

router.get("/api/private", validate, (request: Request, response: Response) => {
	response.status(200).json({ message: "This is protected secure route!" });
});

export default router;
