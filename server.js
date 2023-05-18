const express = require("express");
const admin = require("./Controllers/AccountController");
const cors = require("cors");
const app = express();
const env = require("dotenv");
const sales = require("./Controllers/saleDetails");
const expanses = require("./Controllers/expansesController");
const workdata = require("./Controllers/workDataController");
const workshop = require("./Controllers/workShopController");
const pay = require("./Controllers/paymentController");
const tax = require("./Controllers/taxController");
const txn = require("./Controllers/txnController");

env.config();
app.use(cors({ origin: "*" }));

app.listen(process.env.PORT, (req, res) => {
  console.log("its workinggg");
});

app.use(express.json());

app.use("/api/account", admin);
app.use("/api/sales", sales);
app.use("/api/expanses", expanses);
app.use("/api/workdata", workdata);
app.use("/api/workshop", workshop);
app.use("/api/payment", pay);
app.use("/api/tax", tax);
app.use("/api/txn", txn);
