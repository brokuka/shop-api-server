import verifyJWT from "../middleware/verifyJWT.js";
import { Router } from "express";
import { getOrder, getOrders, order } from "../controllers/order.js";
import verifySession from "../middleware/verifySession.js";

export default (router: Router) => {
  router.post("/order", verifySession, verifyJWT, order);
  router.get("/order/:order_id", verifySession, verifyJWT, getOrder);
  router.get("/order", verifySession, verifyJWT, getOrders);
};
