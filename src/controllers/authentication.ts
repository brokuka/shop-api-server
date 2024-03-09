import {
	UserCredentials,
	getUserByEmail,
	getUserById,
	insertUserTable,
} from "../db/user.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertTokenTable } from "../db/token.js";
import config from "../config.js";
import { badRequest, customResponse, errorResponse } from "../utils/common.js";

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body as UserCredentials;

		if (!email || !password) {
			return badRequest(res);
		}

		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			return errorResponse(res, {
				type: "UNPROCESSABLE_ENTITY",
				message: "EMAIL_EXIST",
			});
		}

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const { user_id } = await insertUserTable({
			email,
			password: passwordHash,
		});

		const refreshToken = jwt.sign({ user_id }, config.SECRET_REFRESH_TOKEN, {
			expiresIn: config.REFRESH_TOKEN_EXPIRE_TIME,
		});

		await insertTokenTable(user_id, refreshToken);

		customResponse(res, "SUCCESS_REGISTER");
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body as UserCredentials;

		if (!email || !password) {
			return badRequest(res);
		}

		const user = await getUserByEmail(email);

		if (!user) {
			return errorResponse(res, {
				type: "UNPROCESSABLE_ENTITY",
				message: "INVALID_USER_DATA",
			});
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return errorResponse(res, {
				type: "FORBIDDEN",
				message: "INVALID_USER_DATA",
			});
		}

		const { user_id, group } = user;

		const accessToken = jwt.sign(
			{ user_id, group },
			config.SECRET_ACCESS_TOKEN,
			{
				expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
			}
		);

		const sessionToken = jwt.sign({ user_id }, config.SECRET_SESSION_TOKEN);

		res.cookie("token", accessToken, {
			httpOnly: true,
			// maxAge: config.COOKIE_TOKEN_LIFETIME,
			sameSite: config.isProduction ? "none" : "lax",
			secure: config.isProduction,
			path: "/",
		});

		const { password: passwordHash, ...etc } = user;

		customResponse(res, {
			message: "SUCCESS_LOGIN",
			data: { ...etc, session: sessionToken },
		});
	} catch (error) {
		console.log(error);
	}
};

export const refresh = async (req: Request, res: Response) => {
	try {
		const user_id = req.body.user_id;

		if (!user_id) {
			return badRequest(res);
		}

		const authHeader =
			req.headers.authorization || (req.headers.Authorization as string);

		if (!authHeader) {
			return errorResponse(res, { type: "UNAUTHORIZED" });
		}

		const sessionToken = authHeader.split(" ")[1];

		jwt.verify(
			sessionToken,
			config.SECRET_SESSION_TOKEN,
			async (error: any) => {
				if (error) {
					return errorResponse(res, { type: "FORBIDDEN" });
				}

				const user = await getUserById(user_id);

				if (!user) {
					return errorResponse(res, { type: "UNAUTHORIZED" });
				}

				const { group } = user;

				const accessToken = jwt.sign(
					{
						user_id,
						group,
					},
					config.SECRET_ACCESS_TOKEN,
					{ expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME }
				);

				res.cookie("token", accessToken, {
					httpOnly: true,
					maxAge: config.COOKIE_TOKEN_LIFETIME,
					sameSite: config.isProduction ? "none" : "lax",
					secure: config.isProduction,
					path: "/",
				});
			}
		);
	} catch (error) {
		console.log(error);
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const cookies = req.cookies;

		if (!cookies?.token) {
			return errorResponse(res, { type: "FORBIDDEN" });
		}

		res.clearCookie("token", {
			httpOnly: true,
			secure: config.isProduction,
			path: "/",
			sameSite: config.isProduction ? "none" : "lax",
		});

		customResponse(res, "SUCCESS_LOGOUT");
	} catch (error) {
		console.log(error);
	}
};
