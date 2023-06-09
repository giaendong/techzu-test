import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {routesConfig as AuthRoute} from "./app/routes/Auth.route.js";
import {routesConfig as UserRoute} from "./app/routes/User.route.js";
import {routesConfig as CommentRoute} from "./app/routes/Comment.route.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const { PORT } = process.env;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(json());
AuthRoute(app);
UserRoute(app);
CommentRoute(app);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});