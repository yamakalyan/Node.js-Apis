const express = require("express");
const workdata = express.Router();
const jwt = require("jsonwebtoken");
const database = require("../Configure/Database");
const dateForToday = require("../Helper/dateCreater");

// WORKDATA LIST
workdata.get("/list", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {

      const workshopDetails = async(workshopId)=>{
      return new Promise((resolve, reject)=>{
      const sql = `SELECT * FROM workshop WHERE workshop_id='${workshopId}' AND workshop_ifdeleted='0'`;
      database.query(sql, (err, workshop) => {
        if (err) {
            reject(err)
        }else{
          resolve(workshop)
        }
      })
        })
      }
      
      const sql = `SELECT * FROM workdata WHERE workdata_ifdeleted='0'`;
      database.query(sql, async(err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having issues while connecting.",
            err,
          });
        } else {

          for (let i = 0; i < results.length; i++) {
            const workshopID = results[i].workshop_id
            results[i].workshop = await workshopDetails(workshopID)
            
          }
          
          res.status(200).json({
            success: true,
            message: "Succesfully found workdata lists",
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
// WORKDATA UNIQUE ID
workdata.get("/:input_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const workshopId = req.params.input_id;

      
      const workshopDetails = async(workshopId)=>{
        return new Promise((resolve, reject)=>{
        const sql = `SELECT * FROM workshop WHERE workshop_id='${workshopId}' AND workshop_ifdeleted='0'`;
        database.query(sql, (err, workshop) => {
          if (err) {
              reject(err)
          }else{
            resolve(workshop)
          }
        })
          })
        }
        

      const sql = `SELECT * FROM workdata WHERE workdata_id ='${workshopId}' OR workshop_id='${workshopId}' AND workdata_ifdeleted='0'`;
      database.query(sql, async(err, results) => {
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
              message: "Workdata not found",
            });
          } else {  
          for (let i = 0; i < results.length; i++) {
            const workshopID = results[i].workshop_id
            results[i].workshop = await workshopDetails(workshopID)
            
          }
            res.status(200).json({
              success: true,
              message: "Successfully found workdata",
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
// WORKDATA CREATE
workdata.post("/create", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const id = Math.floor(10000000 + Math.random() * 99999999);

      const workDatacreateQuery = `INSERT INTO workdata(workdata_id, workshop_id, forwared_wt, received_wt,
             workdata_status, workdata_ifdeleted, created) VALUES('${id}', '${req.body.workshop_id}', '${req.body.forwared_wt}',
             '${req.body.received_wt}', '0', '0', '${dateForToday}')`;

      database.query(workDatacreateQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some internal issues.",
            err,
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Succesfully added workdata.",
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
// WORKDATA UPDATE
workdata.put("/update/:workdata_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const workdataId = req.params.workdata_id;

      const sql = `SELECT * FROM workdata WHERE workdata_id ='${workdataId}' OR workshop_id='${workdataId}' AND workdata_ifdeleted='0'`;
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
            const updateWorkShopQuery = `UPDATE workdata SET workshop_id='${req.body.workshop_id}', forwared_wt='${req.body.forwared_wt}', received_wt='${req.body.received_wt}',
            workdata_status = '${req.body.workdata_status}' WHERE workdata_id ='${workdataId}'`;

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
                  message: "Succesfully updated workdata.",
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
// WORKDATA DELETE
workdata.delete("/delete/:workdata_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const workId = req.params.workdata_id;

      const sql = `SELECT * FROM workdata WHERE workdata_id='${workId}' OR workshop_id ='${workId}' AND workdata_ifdeleted='0'`;
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
              message: "Workdata not found",
              err,
            });
          } else {
            const deleteWorkDataQuery = `UPDATE workdata SET workdata_ifdeleted='1'
                        WHERE workdata_id='${workId}'`;

            database.query(deleteWorkDataQuery, (err, delResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having issues while connecting.",
                  err,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: "Succesfully deleted workdata.",
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

module.exports = workdata;
