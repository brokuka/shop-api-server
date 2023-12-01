import { UpdateUserData, getUserById, updateUserTable } from "../db/user.js";
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

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const { middlename, name, surname } = req.body as Omit<
      UpdateUserData,
      "user_id"
    >;

    if (!middlename && !name && !surname) {
      return res.status(400).json({ message: "Ошибка в теле запроса" });
    }

    const updatedInfo = await updateUserTable({
      middlename,
      name,
      surname,
      user_id: req.user_id,
    });

    const { password, ...etc } = updatedInfo;

    res.json({ user: { ...etc }, message: "Профиль успешно изменён" });
  } catch (error) {
    console.log(error);
  }
};
