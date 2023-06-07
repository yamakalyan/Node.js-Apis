const express = require("express");
const tax = express.Router();
const jwt = require("jsonwebtoken");
const database = require("../../Configure/Database");

//  GET TAX DETAILS
tax.get("/details/:tax_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const id = req.params.tax_id;

      const taxDetailQuery = `SELECT * FROM tax_details WHERE tax_id='${id}' AND tax_ifdeleted='0'`;
      database.query(taxDetailQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having issues while connecting server.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Successfully found tax details.",
            results,
          });
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
      error,
    });
  }
});
// TAX CREATION
tax.post("/create", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    const Today = new Date();
    let dayT = Today.getDay();
    let monthT = Today.getMonth() + 1;
    let yearT = Today.getFullYear();
    if (dayT < 10) {
      dayT = "0" + dayT;
    }
    if (monthT < 10) {
      monthT = "0" + monthT;
    }
    const dateForToday = yearT + "-" + monthT + "-" + dayT;
    if (verify) {
      const createTax = `INSERT INTO tax_details(tax_id, tax_name, tax_percentage, tax_status, tax_ifdeleted, created)
            VALUES ('${Math.floor(10000 + Math.random() * 99999)}', '${
        req.body.tax_name
      }', '${req.body.tax_percentage}', 
            '0', '0', '${dateForToday}')`;
      database.query(createTax, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Successfully created tax",
          });
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
      error,
    });
  }
});
module.exports = tax;
