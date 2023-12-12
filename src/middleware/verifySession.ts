import config from "../config.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { badRequest, errorResponse } from "../utils/common.js";

export default function verifySession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user_id = req.body.user_id;
    const authHeader =
      req.headers.authorization || (req.headers.Authorization as string);

    if (!authHeader) {
      return errorResponse(res, "UNAUTHORIZED");
    }

    if (!user_id) {
      return badRequest(res);
    }

    const session = authHeader.split(" ")[1];

    jwt.verify(session, config.SECRET_SESSION_TOKEN, (error: any) => {
      if (error) {
        return errorResponse(res, "FORBIDDEN");
      }

      req.user_id = user_id;

      next();
    });
  } catch (error) {
    console.log(error);
  }
}
