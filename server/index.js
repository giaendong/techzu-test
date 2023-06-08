const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./app/routes/Auth.route");
const userRoute = require("./app/routes/User.route")
const { PORT } = process.env;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
authRoute.routesConfig(app);
userRoute.routesConfig(app);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});