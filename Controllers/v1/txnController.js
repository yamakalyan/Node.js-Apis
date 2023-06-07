const express = require("express");
const txn = express.Router();
const jwt = require("jsonwebtoken");
const database = require("../../Configure/Database");

txn.get("/list", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;
    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const txnQuery = `SELECT * FROM txn_details WHERE txn_ifdeleted='0'`;
      database.query(txnQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having technical issues",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "No transations found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "Succesfully found transations",
              results,
            });
          }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: "invalidToken",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message : "internalServerError",
      error,
    });
  }
});

module.exports = txn;
