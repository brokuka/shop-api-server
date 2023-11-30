import verifyJWT from "../middleware/verifyJWT.js";
import { Router } from "express";
import { user } from "../controllers/user.js";

export default (router: Router) => {
  router.get("/user", verifyJWT, user);
};
