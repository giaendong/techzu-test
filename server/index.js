import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import { createServer } from 'http';
import {routesConfig as AuthRoute} from "./app/routes/Auth.route.js";
import {routesConfig as UserRoute} from "./app/routes/User.route.js";
import {routesConfig as CommentRoute} from "./app/routes/Comment.route.js";
import {routesConfig as ReviewRoute} from "./app/routes/Review.route.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const { PORT, CLIENT_URL } = process.env;

app.use(
  cors({
    origin: [CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(json());
AuthRoute(app);
UserRoute(app);
CommentRoute(app);
ReviewRoute(app);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log("User connected: ", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

global.io = io;