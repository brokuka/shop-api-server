import verifyJWT from "../middleware/verifyJWT.js";
import { Router } from "express";
import { updateUserData, user } from "../controllers/user.js";
import verifySession from "../middleware/verifySession.js";

export default (router: Router) => {
  router.get("/user", verifyJWT, user);
  router.patch("/user", verifySession, verifyJWT, updateUserData);
};
