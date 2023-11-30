import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/index.js";
import { notFound } from "./middleware/notFound.js";
import config from "./config.js";

const app = express();

const origin = config.isProduction
  ? "https://shop-api-client.vercel.app"
  : `http://localhost:${config.SERVER_PORT}`;

app.use(cors({ credentials: true, origin }));
app.use(cookieParser());
app.use(express.json());

app.use("/api", router());

app.use(notFound);

export default app;
