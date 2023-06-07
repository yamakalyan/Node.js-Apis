const express = require("express");
const jwt = require("jsonwebtoken");
const database = require("../../Configure/Database");
const stock = express.Router();
const dateForToday = require("../../Helper/dateCreater");

// LIST OF STOCKS FOR SALE
stock.get("/list", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const stockQuery = `SELECT * FROM stocks WHERE stock_status='0' AND stock_ifdeleted='0'`;
      database.query(stockQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "No stocks found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "stocks found succesfully",
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
      message: "internalServerError",
      error,
    });
  }
});

stock.get("/stocklist", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const stockQuery = `SELECT * FROM stocks WHERE  stock_ifdeleted='0'`;
      database.query(stockQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "No stocks found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "stocks found succesfully",
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
      message: "internalServerError",
      error,
    });
  }
});

// UNIQUE STOCK
stock.get("/:stock_id", (req, res) => {
  try {
    const stockId = req.params.stock_id;
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const stockQuery = `SELECT * FROM stocks WHERE stock_id ='${stockId}' AND stock_ifdeleted='0'`;
      database.query(stockQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "No stock found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "Stock found succesfully",
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
      message: "internalServerError",
      error,
    });
  }
});

// STOCK CREATE
stock.post("/create", (req, res) => {
  try {
    const stockId = "ST" + Math.floor(10000000 + Math.random() * 99999999);
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const stockQuery = `INSERT INTO stocks(stock_id, stock_name, stock_type, stock_quantity, 
              stock_available, stock_price, stock_status, stock_ifdeleted, created) 
              VALUES ('${stockId}','${req.body.stock_name}','${req.body.stock_type}','${req.body.stock_quantity}','${req.body.stock_available}',
              '${req.body.stock_price}','${req.body.stock_status}','0','${dateForToday}')`;
      database.query(stockQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Stock created succesfully",
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
      message: "internalServerError",
      error,
    });
  }
});

// STOCK UPDATE
stock.put("/update/:stock_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const stockQuery = `UPDATE stocks SET stock_name='${req.body.stock_name}', stock_status='${req.body.stock_status}' 
        WHERE stock_id='${req.params.stock_id}' AND stock_ifdeleted='0'`;
      database.query(stockQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Stock updated succesfully",
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
      message: "internalServerError",
      error,
    });
  }
});

// STOCK DELETE WITH ID
stock.delete("/delete/:stock_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const stockQuery = `UPDATE stocks SET stock_ifdeleted='1' WHERE stock_id='${req.params.stock_id}' AND stock_ifdeleted='0'`;
      database.query(stockQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Stock deleted succesfully",
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
      message: "internalServerError",
      error,
    });
  }
});

module.exports = stock;
