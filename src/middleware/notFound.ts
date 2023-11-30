import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/") {
    return res.json({ message: "Welcome to the shop api =)" });
  }

  res.status(404).json({ message: "Не правильный путь" });
  next();
}
