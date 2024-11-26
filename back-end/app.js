const express = require("express");
const { setHeaders } = require("./middlewares/headers.middleware");
const { errorHandler } = require("./middlewares/errors.middleware");
const cookieParser = require('cookie-parser');
const cors = require('cors');


//*routes import
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

const app = express();


//* BodyPaser
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));


//* CookieParser
app.use(cookieParser());


//* CORS Policy Definitions
app.use(setHeaders);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


//* Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


//* Error Controller
app.use((req, res) => {
  console.log("This path is not available:", req.path);
  res.status(404).json({ message: "404 OOPS! PATH NOT FOUND" });
});
app.use(errorHandler);


module.exports = app;
