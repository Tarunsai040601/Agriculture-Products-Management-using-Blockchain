// express
const express = require("express");
require("dotenv").config({ quiet: true });
const connectDatabase = require("./Config/Config.js");
const authRouter = require("./Routers/AuthRouters/authRouter.js");
const FarmerRouter = require("./Routers/createFarmerRouter/FarmerRouter.js");
const dealerRoute = require("./Routers/createDealer/Dealer.js");
const farmerPostRouter = require("./Routers/FarmerPostRoute/FarmerPostRouter.js");
const dealerOrderRouter = require("./Routers/DealerOrderRoute/DealerOrderRouter.js");
const cors=require('cors')
const app = express();

// built-in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
// router middleware auth router
app.use("/api/auth", authRouter);
// create farmers router
app.use("/api/create", FarmerRouter);
// create dealer router
app.use("/api/dealer", dealerRoute);
// farmer post router
app.use("/api/farmer", farmerPostRouter);
// dealer order router
app.use("/api/dealer-order", dealerOrderRouter);
// port
const port = process.env.PORT || 8045;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`server is runing on the http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Server start failed due to DB issue:", error.message);
    process.exit(1);
  }
};

startServer();
