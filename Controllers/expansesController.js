const express = require("express");
const database = require("../Configure/Database");
const expanses = express.Router();
const jwt = require("jsonwebtoken");
const dateForToday = require("../Helper/dateCreater");

// LIST OF EXPANSES
expanses.get("/list", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const expanseQuery = `SELECT * FROM expanses WHERE expanse_ifdeleted='0'`;
      database.query(expanseQuery, (err, results) => {
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
              message: "No expanses found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "Expanses found succesfully",
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
      error,
    });
  }
});

// UNIQUE EXPANSE
expanses.get("/:expanse_id", (req, res) => {
  try {
    const expanseId = req.params.expanse_id;
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const expanseQuery = `SELECT * FROM expanses WHERE expanse_id ='${expanseId}' AND expanse_ifdeleted='0'`;
      database.query(expanseQuery, (err, results) => {
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
              message: "No expanse found",
            });
          } else {
            const details = {
              expanse_id: results[0].expanse_id,
              expanse_by_name: results[0].expanse_by_name,
              expanse_by_mobile_no: results[0].expanse_by_mobile_no,
              expanse_type: results[0].expanse_type,
              expanse_amount: results[0].expanse_amount,
              expanse_reason: results[0].expanse_reason,
              date: results[0].date,
            };
            res.status(200).json({
              success: true,
              message: "Expanse found succesfully",
              details,
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
      error,
    });
  }
});

// EXPANSE CREATE
expanses.post("/create", (req, res) => {
  try {
    const expanseId = Math.floor(10000000 + Math.random() * 99999999);
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const expanseQuery = `INSERT INTO expanses(expanse_id, expanse_by_name, expanse_by_mobile_no, expanse_type, 
            expanse_amount, expanse_reason, expanse_status, expanse_ifdeleted, date) 
            VALUES ('${expanseId}','${req.body.expanse_name}','${req.body.expanse_mobile}','${req.body.expanse_type}','${req.body.expanse_amount}',
            '${req.body.expanse_reason}','0','0','${dateForToday}')`;
      database.query(expanseQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Expanse created succesfully",
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

// EXPANSE UPDATE
expanses.put("/update/:expanse_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const expanseQuery = `UPDATE expanses SET expanse_by_name='${req.body.expanse_name}',expanse_by_mobile_no='${req.body.expanse_mobile}',
      expanse_type='${req.body.expanse_type}', expanse_amount='${req.body.expanse_amount}', expanse_reason='${req.body.expanse_reason}' 
      WHERE expanse_id='${req.params.expanse_id}' AND expanse_ifdeleted='0'`;
      database.query(expanseQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Expanse updated succesfully",
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

// EXPANSE DELETE WITH ID
expanses.delete("/delete/:expanse_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const expanseQuery = `UPDATE expanses SET expanse_ifdeleted='1' WHERE expanse_id='${req.params.expanse_id}' AND expanse_ifdeleted='0'`;
      database.query(expanseQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Expanse deleted succesfully",
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

module.exports = expanses;
