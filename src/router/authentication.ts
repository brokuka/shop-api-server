import verifyJWT from "../middleware/verifyJWT.js";
import {
  login,
  logout,
  refresh,
  register,
} from "../controllers/authentication.js";
import { Router } from "express";
import verifySession from "../middleware/verifySession.js";

export default (router: Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post("/auth/refresh", verifySession, refresh);
  router.post("/auth/logout", verifySession, verifyJWT, logout);
};
