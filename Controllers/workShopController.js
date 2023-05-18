const express = require("express");
const workshop = express.Router();
const jwt = require("jsonwebtoken");
const database = require("../Configure/Database");
const dateForToday = require("../Helper/dateCreater");

// WORKSHOP LIST
workshop.get("/list", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const sql = `SELECT * FROM workshop WHERE workshop_ifdeleted='0'`;
      database.query(sql, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having issues while connecting.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Succesfully found workshop lists",
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
// WORKSHOP UNIQUE ID
workshop.get("/:workshop_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const workshopId = req.params.workshop_id;

      const sql = `SELECT * FROM workshop WHERE workshop_id ='${workshopId}' OR workshop_number='${workshopId}' AND workshop_ifdeleted='0'`;
      database.query(sql, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having issues while connecting.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "Workshop not found",
            });
          } else {
            const details = {
              workshop_id: results[0].workshop_id,
              workshop_name: results[0].workshop_name,
              workshop_number: results[0].workshop_number,
            };
            res.status(200).json({
              success: true,
              message: "Successfully found workshop",
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
// WORKSHOP CREATE
workshop.post("/create", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const id = Math.floor(10000000 + Math.random() * 99999999);

      const workshopcreateQuery = `INSERT INTO workshop(workshop_id, workshop_name, workshop_number,
             workshop_status, workshop_ifdeleted, created) VALUES('${id}', '${req.body.workshop_name}',
              '${req.body.workshop_number}', '0', '0', '${dateForToday}')`;
      database.query(workshopcreateQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Succesfully added workshop.",
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
// WORKSHOP UPDATE
workshop.put("/update/:workshop_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const workshopId = req.params.workshop_id;

      const sql = `SELECT * FROM workshop WHERE workshop_id ='${workshopId}' AND workshop_ifdeleted='0'`;
      database.query(sql, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having issues while connecting.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "Workshop not found",
              err,
            });
          } else {
            const updateWorkShopQuery = `UPDATE workshop SET workshop_name='${req.body.workshop_name}', workshop_number='${req.body.workshop_number}'
                    WHERE workshop_id='${workshopId}' AND workshop_ifdeleted='0'`;

            database.query(updateWorkShopQuery, (err, updateResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having issues while connecting.",
                  err,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: "Succesfully updated workshop.",
                  updateResults,
                });
              }
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
// WORKSHOP DELETE
workshop.delete("/delete/:workshop_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const workshopId = req.params.workshop_id;

      const sql = `SELECT * FROM workshop WHERE workshop_id ='${workshopId}' AND workshop_ifdeleted='0'`;
      database.query(sql, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having issues while connecting.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "Workshop not found",
              err,
            });
          } else {
            const deleteWorkShopQuery = `UPDATE workshop SET workshop_ifdeleted='1'
                        WHERE workshop_id='${workshopId}' AND workshop_ifdeleted='0'`;

            database.query(deleteWorkShopQuery, (err, delResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having issues while connecting.",
                  err,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: "Succesfully deleted workshop.",
                });
              }
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

module.exports = workshop;
