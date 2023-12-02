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

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as UserCredentials;

    if (!email || !password) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким Email уже зарегистрирован" });
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

    res.json({ message: "Регистрация успешно пройдена" });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as UserCredentials;

    if (!email || !password) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .status(403)
        .json({ message: "Неверно указаны пользовательские данные" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(403)
        .json({ message: "Неверно указаны пользовательские данные" });
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
      maxAge: config.COOKIE_TOKEN_LIFETIME,
      sameSite: config.isProduction ? "none" : "lax",
      secure: config.isProduction,
      path: "/",
    });

    const { password: passwordHash, ...etc } = user;

    res.json({ ...etc, session: sessionToken });
  } catch (error) {
    console.log(error);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const user_id = req.body.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const authHeader =
      req.headers.authorization || (req.headers.Authorization as string);

    if (!authHeader) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const sessionToken = authHeader.split(" ")[1];

    jwt.verify(
      sessionToken,
      config.SECRET_SESSION_TOKEN,
      async (error: any, decoded: any) => {
        if (error) {
          return res.status(403).json({ message: "Ошибка доступа" });
        }

        const user = await getUserById(user_id);

        if (!user) {
          return res.status(401).json({ message: "Не авторизован" });
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

        return res.json({ message: "Токен использования обновлён" });
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
      return res.sendStatus(204);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: config.isProduction,
      path: "/",
      sameSite: config.isProduction ? "none" : "lax",
    });
    res.json({ message: "Выход произошёл успешно" });
  } catch (error) {
    console.log(error);
  }
};
