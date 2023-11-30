import verifyJWT from "../middleware/verifyJWT.js";
import { Router } from "express";
import {
  cart,
  deleteCartItem,
  getCart,
  updateCart,
} from "../controllers/cart.js";
import verifySession from "../middleware/verifySession.js";

export default (router: Router) => {
  router.get("/cart", verifyJWT, getCart);
  router.post("/cart", verifySession, verifyJWT, cart);
  router.post("/cart/update", verifySession, verifyJWT, updateCart);
  router.delete("/cart/:product_id", verifySession, verifyJWT, deleteCartItem);
};
