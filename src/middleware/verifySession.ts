import config from "../config.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
      return res.status(401).json({ message: "Не авторизован" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const session = authHeader.split(" ")[1];

    jwt.verify(session, config.SECRET_SESSION_TOKEN, (error: any) => {
      if (error) {
        return res.status(403).json({ message: "Ошибка доступа" });
      }

      req.user_id = user_id;

      next();
    });
  } catch (error) {
    console.log(error);
  }
}
