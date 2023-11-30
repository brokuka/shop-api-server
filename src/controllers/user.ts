import { getUserById } from "../db/user.js";
import { Response, Request } from "express";

export const user = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user_id);

    const { password: passwordHash, ...etc } = user;

    res.json({ ...etc });
  } catch (error) {
    console.log(error);
  }
};
