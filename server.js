const express = require("express");
const cors = require("cors");
const app = express();
const env = require("dotenv");

// Initial
// const admin = require("./Controllers/initial/AccountController");
// const sales = require("./Controllers/initial/saleDetails");
// const expanses = require("./Controllers/initial/expansesController");
// const workdata = require("./Controllers/initial/workDataController");
// const workshop = require("./Controllers/initial/workShopController");
// const pay = require("./Controllers/initial/paymentController");
// const tax = require("./Controllers/initial/taxController");
// const txn = require("./Controllers/initial/txnController");
// const stock = require("./Controllers/initial/StockController")

// Version 1
const adminV1 = require("./Controllers/v1/AccountController");
const salesV1 = require("./Controllers/v1/saleDetails");
const expansesV1 = require("./Controllers/v1/expansesController");
const workdataV1 = require("./Controllers/v1/workDataController");
const workshopV1 = require("./Controllers/v1/workShopController");
const payV1 = require("./Controllers/v1/paymentController");
const taxV1 = require("./Controllers/v1/taxController");
const txnV1 = require("./Controllers/v1/txnController");
const stockV1 = require("./Controllers/v1/StockController");

env.config();
app.use(cors({ origin: "*" }));

app.listen(process.env.PORT, (req, res) => {
  console.log("its workinggg");
});

app.use(express.json());

// Initial
// app.use("/api/account", admin);
// app.use("/api/sales", sales);
// app.use("/api/expanses", expanses);
// app.use("/api/workdata", workdata);
// app.use("/api/workshop", workshop);
// app.use("/api/payment", pay);
// app.use("/api/tax", tax);
// app.use("/api/txn", txn);
// app.use("/api/stock", stock)

// Version 1
app.use("/api/v1/account", adminV1);
app.use("/api/v1/sales", salesV1);
app.use("/api/v1/expanses", expansesV1);
app.use("/api/v1/workdata", workdataV1);
app.use("/api/v1/workshop", workshopV1);
app.use("/api/v1/payment", payV1);
app.use("/api/v1/tax", taxV1);
app.use("/api/v1/txn", txnV1);
app.use("/api/v1/stock", stockV1);
