const express = require("express");
const database = require("../Configure/Database");
const admin = express.Router();
const jwt = require("jsonwebtoken");

//ADMIN CREATION
admin.post("/admin/create", (req, res) => {
  try {
    const id = Math.floor(10000000 + Math.random() * 99999999);
    let encrOrginalName = req.body.admin_email;
    let bufferObj = Buffer.from(encrOrginalName, "utf8");
    let baseToSring = bufferObj.toString("base64");
    console.log(baseToSring);

    let buferDec = Buffer.from(baseToSring, "base64");
    let decode = buferDec.toString("utf8");
    console.log(decode);

    const checkingQuery = `SELECT * FROM admins WHERE admin_email='${req.body.admin_email}' AND admin_ifdeleted='0'`;

    database.query(checkingQuery, (err, checkResults) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: "Having techincal issues.",
          err,
        });
      } else {
        if (checkResults.length === 0) {
          const createSqlQuery = `INSERT INTO admins(admin_id, admin_name, admin_email, admin_password, 
            admin_role, admin_key, admin_status, admin_ifdeleted)
                VALUES ('${id}', '${req.body.admin_name}', '${req.body.admin_email}', '${req.body.admin_password}', 
                '${req.body.admin_role}', '${baseToSring}', '0', '0')`;

          database.query(createSqlQuery, (err, results) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: "Having techincal issues.",
                err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: "Admin have been created Succesfully.",
                results,
              });
            }
          });
        } else {
          res.status(400).json({
            success: false,
            message: "Admin already exists.",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

// CUSTOMERS LIST
admin.get("/customers", (req, res)=>{
  try {
    const headerkey = process.env.JWT_HEADER_KEY
    const securekey = process.env.JWT_SECURE_KEY
    const header = req.header(headerkey)
    const verify = jwt.verify(header, securekey)
    if (verify) {
      const customersQuery = `SELECT * FROM customers WHERE user_ifdeleted='0'`
      database.query(customersQuery, (err, results)=>{
        if (err) {
          res.status(400).json({
            success : false,
            message : "Having technical issues",
            err
          })
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success : false,
              message : "No customers found"
            })
          } else {
            res.status(200).json({
              success : true,
              message : "Succesfully found customers",
              results
            })
          }
        }
      })
    } else {
      res.status(401).json({
        success : false,
        message : "invalidToken"
      })
    }
  } catch (error) {
    res.status(500).json({
      success : false,
      error
    })
  }
})

// GET CUSTOMER WITH MOBILE NUMBER
admin.get("/customer/:number", (req, res)=>{
  try {
    const headerkey = process.env.JWT_HEADER_KEY
    const securekey = process.env.JWT_SECURE_KEY
    const header = req.header(headerkey)
    const verify = jwt.verify(header, securekey)
    if (verify) {
      const customersQuery = `SELECT * FROM customers WHERE user_mobile='${req.params.number}' AND user_ifdeleted='0'`
      database.query(customersQuery, (err, results)=>{
        if (err) {
          res.status(400).json({
            success : false,
            message : "Having technical issues",
            err
          })
        } else {
          if (results.length === 0) {
            res.status(200).json({
              success : false,
              message : "No customer found"
            })
          } else {
            res.status(200).json({
              success : true,
              message : "Succesfully found customer",
              results
            })
          }
        }
      })
    } else {
      res.status(401).json({
        success : false,
        message : "invalidToken"
      })
    }
  } catch (error) {
    res.status(500).json({
      success : false,
      error
    })
  }
})

// AUTHENTICATION CHECK
admin.get("/auth", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;
    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const adminId = verify.admin_id;
      const adminAuthCheckQuery = `SELECT * FROM admins WHERE admin_id ='${adminId}' AND admin_ifdeleted='0'`;
      database.query(adminAuthCheckQuery, (err, authResults) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          if (authResults.length === 0) {
            res.status(400).json({
              success: false,
              message: "Failed to athenticate Admin",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "Successfully Athenticated",
              admin_id: authResults[0].admin_id,
              admin_name: authResults[0].admin_name,
              admin_role: authResults[0].admin_role,
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

// USER LOGIN
admin.post("/login", (req, res) => {
  try {
    const adminEmail = req.body.admin_email;
    const adminPassword = req.body.admin_password;

    const loginSqlQuery = `SELECT * FROM admins WHERE admin_email='${adminEmail}' AND admin_ifdeleted='0' `;

    database.query(loginSqlQuery, (error, results) => {
      if (error) {
        res.status(400).json({
          success: false,
          message: "Facing some technical errors.",
          error,
        });
      } else {
        if (results.length === 0) {
          res.status(400).json({
            success: false,
            message: "User not found.",
          });
        } else {
          const takingPassword = results[0].admin_password;

          if (takingPassword == adminPassword) {
            const user = {
              Time: Date(),
              admin_id: results[0].admin_id,
              admin_email: results[0].admin_email,
              admin_role: results[0].admin_role,
              admin_status: results[0].admin_status,
            };
            const token = jwt.sign(user, process.env.JWT_SECURE_KEY, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });

            res.status(200).json({
              success: true,
              message: "You have logged-In.",
              admin_id: results[0].admin_id,
              admin_name: results[0].admin_name,
              admin_email: results[0].admin_email,
              admin_role: results[0].admin_role,
              admin_status: results[0].admin_status,
              token,
            });
          } else {
            res.status(400).json({
              success: false,
              message: "wrong password, Try again.",
            });
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

//ADMIN PROFILE PAGE
admin.get("/profile", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const adminId = verify.admin_id;

      const profileQuery = `SELECT * FROM admins WHERE admin_id='${adminId}' AND admin_ifdeleted='0'`;
      database.query(profileQuery, (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Facing some technical issues.",
          });
        } else {
          if (results.length === 0) {
            res.status(400).json({
              success: false,
              message: "Failude to load Profile.",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "You have succesfully visited Profile.",
              admin_id: results[0].admin_id,
              admin_name: results[0].admin_name,
              admin_email: results[0].admin_email,
              admin_role: results[0].admin_role,
              admin_status: results[0].admin_status,
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

module.exports = admin;
