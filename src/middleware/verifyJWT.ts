import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config.js";

export default async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    jwt.verify(
      token,
      config.SECRET_ACCESS_TOKEN,
      async (error: any, decoded: any) => {
        if (error) {
          return res.status(403).json({
            message: "Ошибка доступа",
          });
        }

        const { group, user_id } = decoded;

        const accessToken = jwt.sign(
          { user_id, group },
          config.SECRET_ACCESS_TOKEN,
          {
            expiresIn: config.ACCESS_TOKEN_EXPIRE_TIME,
          }
        );

        res.cookie("token", accessToken, {
          httpOnly: true,
          maxAge: config.COOKIE_TOKEN_LIFETIME,
          sameSite: config.isProduction ? "none" : "lax",
          secure: config.isProduction,
          path: "/",
        });

        req.user_id = user_id;
        req.group = group;

        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
}
