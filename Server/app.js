// express
const express = require("express");
const dotenv = require("dotenv").config({ quiet: true });
const DataBase = require("./Config/Config.js");
const authRouter = require("./Routers/AuthRouters/authRouter.js");
const FarmerRouter = require("./Routers/createFarmerRouter/FarmerRouter.js");
const dealerRoute = require("./Routers/createDealer/Dealer.js");
const app = express();

// built-in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// router middleware auth router
app.use("/api/auth", authRouter);
// create farmers router
app.use("/api/create", FarmerRouter);
// create dealer router
app.use("/api/dealer", dealerRoute);
// port
const port = process.env.PORT || 8045;

// APP LISTEN
app.listen(port, () => {
  console.log(`server is runing on the http://localhost:${port}`);
});

// database calling
DataBase;
