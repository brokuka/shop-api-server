import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/index.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

const origin = ["http://localhost:3000", "http://localhost:3001", "https://www.shop-api.online"];

app.use(cors({ credentials: true, origin }));
app.use(cookieParser());
app.use(express.json());

app.use("/api", router());

app.use(notFound);

export default app;
