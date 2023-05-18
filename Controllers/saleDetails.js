const express = require("express");
const sales = express.Router();
const jwt = require("jsonwebtoken");
const database = require("../Configure/Database");
const paymentLink = require("../Helper/paymentLink");
const dateForToday = require("../Helper/dateCreater");

// SINGLE SALE
sales.get("/:sale_id", (req, res) => {
  try {
    const saleId = req.params.sale_id;
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const customerDetails = async (customer) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM customers WHERE user_id ='${customer}' AND user_ifdeleted='0'`;
          database.query(customerQuery, (err, customerDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(customerDetails);
            }
          });
        });
      };

      const saleAddOnDetails = async (saleAddOns) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_addons WHERE sale_id ='${saleAddOns}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, addOnDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(addOnDetails);
            }
          });
        });
      };

      const saleExchangeDetails = async (saleExchange) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_exchange WHERE sale_id ='${saleExchange}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, exchangeDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeDetails);
            }
          });
        });
      };

      const salePriceDetails = async (salePrice) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_price_details WHERE sale_id ='${salePrice}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, priceDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(priceDetails);
            }
          });
        });
      };

      const salesQuery = `SELECT * FROM sale_details WHERE sale_id='${saleId}' AND sale_ifdeleted='0' `;

      database.query(salesQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some internal issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(200).json({
              success: false,
              message: "No sale found on this Id.",
            });
          } else {
            for (let i = 0; i < results.length; i++) {
              var customer = results[i].user_id;
              results[i].customerDetails = await customerDetails(customer);

              const saleAddOns = results[i].sale_id;
              results[i].addOnDetails = await saleAddOnDetails(saleAddOns);

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const salePrice = results[i].sale_id;
              results[i].priceDetails = await salePriceDetails(salePrice);
            }
            res.status(200).json({
              success: true,
              message: "Sale found Succesfully.",
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

// GET CUSTOMERS DUES
sales.get("/by/due", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const customerDetails = async (customer) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM customers WHERE user_id ='${customer}' AND user_ifdeleted='0'`;
          database.query(customerQuery, (err, customerDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(customerDetails);
            }
          });
        });
      };

      const saleAddOnDetails = async (saleAddOns) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_addons WHERE sale_id ='${saleAddOns}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, addOnDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(addOnDetails);
            }
          });
        });
      };

      const saleExchangeDetails = async (saleExchange) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_exchange WHERE sale_id ='${saleExchange}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, exchangeDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeDetails);
            }
          });
        });
      };

      const salePriceDetails = async (salePrice) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_price_details WHERE sale_id ='${salePrice}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, priceDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(priceDetails);
            }
          });
        });
      };

      const dueSalesQuery = `SELECT * FROM sale_details WHERE sale_status='0' AND sale_ifdeleted ='0'`;

      database.query(dueSalesQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some technical issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(200).json({
              success: false,
              message: "Dues are empty.",
            });
          } else {
            for (let i = 0; i < results.length; i++) {
              var customer = results[i].user_id;
              results[i].customerDetails = await customerDetails(customer);

              const saleAddOns = results[i].sale_id;
              results[i].addOnDetails = await saleAddOnDetails(saleAddOns);

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const salePrice = results[i].sale_id;
              results[i].priceDetails = await salePriceDetails(salePrice);
            }

            res.status(200).json({
              success: true,
              message: "Successfully found dues.",
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

// GET CUSTOMERS PAID
sales.get("/by/paid", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const customerDetails = async (customer) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM customers WHERE user_id ='${customer}' AND user_ifdeleted='0'`;
          database.query(customerQuery, (err, customerDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(customerDetails);
            }
          });
        });
      };

      const saleAddOnDetails = async (saleAddOns) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_addons WHERE sale_id ='${saleAddOns}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, addOnDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(addOnDetails);
            }
          });
        });
      };

      const saleExchangeDetails = async (saleExchange) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_exchange WHERE sale_id ='${saleExchange}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, exchangeDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeDetails);
            }
          });
        });
      };

      const salePriceDetails = async (salePrice) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_price_details WHERE sale_id ='${salePrice}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, priceDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(priceDetails);
            }
          });
        });
      };

      const dueSalesQuery = `SELECT * FROM sale_details WHERE sale_status='1' AND sale_ifdeleted ='0'`;

      database.query(dueSalesQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some technical issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(200).json({
              success: false,
              message: "Paids are empty.",
            });
          } else {
            for (let i = 0; i < results.length; i++) {
              var customer = results[i].user_id;
              results[i].customerDetails = await customerDetails(customer);

              const saleAddOns = results[i].sale_id;
              results[i].addOnDetails = await saleAddOnDetails(saleAddOns);

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const salePrice = results[i].sale_id;
              results[i].priceDetails = await salePriceDetails(salePrice);
            }
            res.status(200).json({
              success: true,
              message: "Successfully found paids.",
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

// SALE UPDATE
sales.put("/update/:sale_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const saleDetailsUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const addonsQuery = `UPDATE sale_details SET product_name='${req.body.product_name}', one_gram_price='${req.body.one_gram_price}',
          no_of_grams='${req.body.no_of_grams}', total_grams_price='${req.body.total_grams_price}' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
          database.query(addonsQuery, (err, saleDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(saleDetails);
            }
          });
        });
      };

      const saleAddOnsUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const addonsQuery = `UPDATE sale_addons SET wastage_amount='${req.body.wastage_amount}', making_amount='${req.body.making_amount}',
           stones_amount='${req.body.stone_amount}', no_of_grams='${req.body.no_of_grams}' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;

          database.query(addonsQuery, (err, addonResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(addonResults);
            }
          });
        });
      };

      const saleExchangeUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const exchangeQuery = `UPDATE sale_exchange SET ex_product_name='${req.body.ex_product_name}',
            ex_one_gm_wt='${req.body.ex_one_gm_weight}', ex_purity='${req.body.ex_purity}', ex_netwt='${req.body.ex_netweight}',
             ex_rate_gm='${req.body.ex_rate_gm}', ex_amount='${req.body.ex_amount}' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
          database.query(exchangeQuery, (err, exchangeResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeResults);
            }
          });
        });
      };

      const salePriceDetailsUpdate = async (saleId, txnMethod) => {
        return new Promise((resolve, reject) => {
          const pricedetailsQuery = `UPDATE sale_price_details SET total_price='${req.body.total_price}', tax_at='${req.body.tax_at}',
           tax_total='${req.body.tax_total}', discount_amount='${req.body.discount_amount}', extra_amount='${req.body.extra_amount}', 
           extra_product_desc='${req.body.extra_product_desc}', ex_amount='${req.body.ex_amount}',
             paid_amount='${req.body.paid_amount}', grand_total='${req.body.grand_total}', due_amount='${req.body.due_amount}' 
        WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;

          database.query(pricedetailsQuery, (err, pricedetailsResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(pricedetailsResults);
            }
          });

          if (req.body.update_paid_amount != 0) {
            const txnQueryPaid = `INSERT INTO txn_details(txn_id, user_id, user_mobile, sale_id, order_total, txn_amount, order_due, txn_method,
            txn_status, txn_ifdeleted, date) VALUES ('${Math.floor(
              1000000 + Math.random() * 9999999
            )}', '${req.body.user_id}', '${
              req.body.user_mobile
            }', '${saleId}', '${req.body.grand_total}', '${req.body.paid_amount}', '${req.body.due_amount}',
              '${txnMethod}', '0', '0', '${dateForToday}')`;
            database.query(txnQueryPaid, (err, txnResults) => {
              if (err) {
                reject(err);
              } else {
                resolve(txnResults);
              }
            });
          }

          if (req.body.due_amount == 0) {
            const updateSaleDetailsStatusQuery = `UPDATE sale_details SET sale_status='1' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
            database.query(updateSaleDetailsStatusQuery, (err, Results) => {
              if (err) {
                reject(err);
              } else {
                const updateSalePriceStatusQuery = `UPDATE sale_price_details SET sale_status='1' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
                database.query(
                  updateSalePriceStatusQuery,
                  (err, dueResults) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(dueResults);
                    }
                  }
                );
              }
            });
          }
        });
      };

      const saleDetailsQuery = `SELECT * FROM sale_details WHERE sale_id='${req.params.sale_id}' AND sale_ifdeleted='0'`;
      database.query(saleDetailsQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having technical issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(200).json({
              success: false,
              message: "No sale found",
            });
          } else {
            const saleID = results[0].sale_id;
            const txnMethod = results[0].payment_method;
            await saleDetailsUpdate(saleID);
            await saleAddOnsUpdate(saleID);
            await saleExchangeUpdate(saleID);
            await salePriceDetailsUpdate(saleID, txnMethod);
            res.status(200).json({
              success: true,
              message: "Sale updated succcesfully",
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

// SALE CREATE
sales.post("/create", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const addOns = async (customer, randomNumber) => {
        return new Promise((resolve, reject) => {
          const addonsQuery = `INSERT INTO sale_addons (sale_id, user_id, wastage_amount, making_amount, stones_amount,
            no_of_grams, sale_status, sale_ifdeleted, created)
                VALUES ('${randomNumber}', '${customer}','${req.body.wastage_amount}', '${req.body.making_amount}',
                '${req.body.stone_amount}','${req.body.no_of_grams}','0', '0','${dateForToday}')`;

          database.query(addonsQuery, (err, addonResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(addonResults);
            }
          });
        });
      };
      const exchangeSale = async (customer, randomNumber) => {
        return new Promise((resolve, reject) => {
          const exchangeQuery = `INSERT INTO sale_exchange(sale_id, user_id, ex_product_name,
            ex_one_gm_wt, ex_purity, ex_netwt, ex_rate_gm, ex_amount, sale_status, sale_ifdeleted, created)
              VALUES ('${randomNumber}', '${customer}','${req.body.ex_product_name}', '${req.body.ex_one_gm_weight}',
              '${req.body.ex_purity}','${req.body.ex_netweight}','${req.body.ex_rate_gm}','${req.body.ex_amount}', '0', '0','${dateForToday}')`;

          database.query(exchangeQuery, (err, exchangeResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeResults);
            }
          });
        });
      };
      const salePriceDetails = async (
        due_amount,
        txnMethod,
        customer,
        randomNumber
      ) => {
        return new Promise((resolve, reject) => {
          const pricedetailsQuery = `INSERT INTO sale_price_details(sale_id, user_id, total_price, tax_at, tax_total,
        discount_amount, flatform_charges, extra_amount, extra_product_desc, ex_amount, paid_amount, grand_total, due_amount, sale_status, sale_ifdeleted, created)
            VALUES ('${randomNumber}', '${customer}','${req.body.total_price}', '${req.body.tax_at}',
            '${req.body.tax_total}','${req.body.discount_amount}','${txnMethod}','${req.body.extra_amount}','${req.body.extra_product_desc}',
             '${req.body.ex_amount}', '${req.body.paid_amount}',
            '${req.body.grand_total}', '${due_amount}', '0', '0','${dateForToday}' )`;

          database.query(pricedetailsQuery, (err, pricedetailsResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(pricedetailsResults);
            }
          });

          if (req.body.paid_amount != 0) {
            const txnQueryPaid = `INSERT INTO txn_details(txn_id, user_id, user_mobile, sale_id, order_total, txn_amount, order_due, txn_method,
            txn_status, txn_ifdeleted, date) VALUES ('${Math.floor(
              1000000 + Math.random() * 9999999
            )}', '${customer}', '${
              req.body.user_mobile
            }', '${randomNumber}', '${req.body.grand_total}', '${req.body.paid_amount}', '${due_amount}', 
              '${req.body.payment_method}', '0', '0', '${dateForToday}')`;
            database.query(txnQueryPaid, (err, txnResults) => {
              if (err) {
                reject(err);
              } else {
                resolve(txnResults);
                console.log(txnResults)
              }
            });
          }
          if (due_amount == 0) {
            const updateSaleDetailsStatusQuery = `UPDATE sale_details SET sale_status='1' WHERE sale_id='${randomNumber}' `;
            database.query(updateSaleDetailsStatusQuery, (err, dueResults) => {
              if (err) {
                reject(err);
              } else {
                const updateSalePriceStatusQuery = `UPDATE sale_price_details SET sale_status='1' WHERE sale_id='${randomNumber}' `;
                database.query(
                  updateSalePriceStatusQuery,
                  (err, dueResults) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(dueResults);
                    }
                  }
                );
              }
            });
          }
        });
      };
      const sharePaymentLink = async (
        customer,
        customerMobile,
        randomNumber,
        due_amount
      ) => {
        return new Promise((resolve, reject) => {
          const customerSqlQuery = `SELECT * FROM customers WHERE user_id='${customer}' OR user_mobile='${customerMobile}' AND user_ifdeleted='0'`;
          database.query(customerSqlQuery, (err, userResults) => {
            if (err) {
              reject(err);
            } else {
              if (userResults.length === 0) {
                resolve("User not found on those details.");
              } else {
                const options = {
                  name: userResults[0].user_name,
                  email: userResults[0].user_email,
                  contact: userResults[0].user_mobile,
                  user_id: userResults[0].user_id,
                  sale_id: randomNumber,
                  product_name: req.body.product_name,
                  grand_total: req.body.grand_total,
                  no_of_grams: req.body.no_of_grams,
                };

                const Desc =
                  "Dues for your" +
                  " " +
                  req.body.product_name +
                  " " +
                  "Thankyou.";
                paymentLink(due_amount, options, Desc);
                resolve(userResults);
              }
            }
          });
        });
      };

      const saleFunctonsWorkPromises = async (customerId,customerMobile,bodyMobile) => {
        return new Promise((resolve, reject) => {
          
          const randomNumber = Math.floor(10000000 + Math.random() * 99999999);
          let txnMethod = req.body.payment_method;

          const due_amount = req.body.due_amount;

          if (txnMethod == "O") {
            txnMethod = (due_amount * 2.2) / 100;
          } else {
            txnMethod = 0;
          }
          if (customerMobile != bodyMobile) {
            console.log("insert wokrs ");
            const customerCreation = `INSERT INTO customers (user_id, user_name, user_mobile, user_email, user_address, user_status, user_ifdeleted, created)
            VALUES ('${customerId}', '${req.body.user_name}', '${customerMobile}', '${req.body.user_email}', 
            '${req.body.user_address}', '0', '0', '${dateForToday}')`;
            database.query(customerCreation, (err, customerResults) => {
              if (err) {
                reject(err);
              } else {
                resolve(customerResults);
              }
            });
          }
          const detailsQuery = `INSERT INTO sale_details(sale_id, user_id, user_mobile, product_name, one_gram_price,
            no_of_grams, total_grams_price, payment_method, sale_status, sale_ifdeleted, created)
                 VALUES ('${randomNumber}', '${customerId}','${customerMobile}','${req.body.product_name}','${req.body.one_gram_price}', '${req.body.no_of_grams}','${req.body.total_price}',
            '${req.body.payment_method}', '0', '0', '${dateForToday}')`;
          database.query(detailsQuery, async (err, saleResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(saleResults);
              await addOns(customerId, randomNumber);
              await exchangeSale(customerId, randomNumber);
              await salePriceDetails(
                due_amount,
                txnMethod,
                customerId,
                randomNumber
              );

              if ((req.body.payment_method == "O") & (due_amount != 0)) {
                await sharePaymentLink(
                  customerId,
                  customerMobile,
                  randomNumber,
                  due_amount
                );
              }

            }
          });
        });
      };

      const checkingCustomerQuery = `SELECT * FROM customers WHERE user_mobile ='${req.body.user_mobile}' AND user_ifdeleted='0'`;
      database.query(checkingCustomerQuery, async (err, checkingResults) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues.",
            err,
          });
        } else {
          if (checkingResults.length == 0) {
            const customerID = Math.floor(100000 + Math.random() * 999999);
            const mobile = req.body.user_mobile;
            await saleFunctonsWorkPromises(customerID, mobile);
            
            res.status(200).json({
              success: true,
              message: "Successfully created sale.",
            });
          } else {
            const takeCustomerID = checkingResults[0].user_id;
            const takeCustomerMobile = checkingResults[0].user_mobile;
            const bodyMobile = req.body.user_mobile;

            await saleFunctonsWorkPromises(
              takeCustomerID,
              takeCustomerMobile,
              bodyMobile
            );
            res.status(200).json({
              success: true,
              message: "Successfully created sale.",
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

// TODAYS SALE COUNTS  AND TOTAL SALE COUNTS
sales.post("/stats", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const dueSalesToday = async (dateForToday) => {
        return new Promise((resolve, reject) => {
          const dueQuery = `SELECT SUM(due_amount) AS amount FROM sale_price_details WHERE created='${dateForToday}' AND sale_ifdeleted='0'`;
          database.query(dueQuery, (err, today_sale_due_amount) => {
            if (err) {
              reject(err);
            } else {
              resolve(today_sale_due_amount);
            }
          });
        });
      };

      const totalSalesDue = async () => {
        return new Promise((resolve, reject) => {
          const dueQuery = `SELECT SUM(due_amount) AS amount FROM sale_price_details WHERE sale_status='0' AND sale_ifdeleted='0'`;
          database.query(dueQuery, (err, total_sales_due) => {
            if (err) {
              reject(err);
            } else {
              resolve(total_sales_due);
            }
          });
        });
      };

      const paidSalesToday = async (dateForToday) => {
        return new Promise((resolve, reject) => {
          const paidQuery = `SELECT SUM(paid_amount) AS amount FROM sale_price_details  WHERE created='${dateForToday}' AND sale_ifdeleted='0'`;
          database.query(paidQuery, (err, today_sale_paid_amount) => {
            if (err) {
              reject(err);
            } else {
              resolve(today_sale_paid_amount);
            }
          });
        });
      };

      const totalSalesPaid = async () => {
        return new Promise((resolve, reject) => {
          const paidQuery = `SELECT SUM(paid_amount) AS amount FROM sale_price_details WHERE sale_ifdeleted='0'`;
          database.query(paidQuery, (err, total_sales_paid) => {
            if (err) {
              reject(err);
            } else {
              resolve(total_sales_paid);
            }
          });
        });
      };

      const todayQuery = `SELECT * FROM sale_details WHERE sale_ifdeleted='0'`;
      database.query(todayQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having internal issues while conecting.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(200).json({
              success: false,
              message: "No Sale Details Found!.",
            });
          } else {
            const todayQuery = `SELECT COUNT(sale_id) AS today_count FROM sale_details WHERE created ='${dateForToday}' AND sale_ifdeleted='0'`;
            database.query(todayQuery, async (err, todayResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having internal issues while conecting.",
                  err,
                });
              } else {
                const allSalesQuery = `SELECT COUNT(sale_id) AS total_count FROM sale_details WHERE sale_ifdeleted='0'`;
                database.query(
                  allSalesQuery,
                  async (err, totalSalesResults) => {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        message: "Having internal issues while conecting.",
                        err,
                      });
                    } else {
                      for (let i = 0; i < todayResults.length; i++) {
                        todayResults[i].today_sale_due = await dueSalesToday(
                          dateForToday
                        );
                        todayResults[i].today_sale_paid = await paidSalesToday(
                          dateForToday
                        );
                      }

                      for (let i = 0; i < totalSalesResults.length; i++) {
                        totalSalesResults[i].total_sales_due =
                          await totalSalesDue();
                        totalSalesResults[i].total_sales_paid =
                          await totalSalesPaid();
                      }
                      res.status(200).json({
                        success: true,
                        message: "Sales found succesfully",
                        todayResults,
                        totalSalesResults,
                      });
                    }
                  }
                );
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

// SEARCH SALE WITH ID OR MOBILE
sales.post("/search", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const search_input = req.body.search_input;

      const customerDetails = async (customer) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM customers WHERE user_id ='${customer}' AND user_ifdeleted='0'`;
          database.query(customerQuery, (err, customerDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(customerDetails);
            }
          });
        });
      };

      const saleAddOnDetails = async (saleAddOns) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_addons WHERE sale_id ='${saleAddOns}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, addOnDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(addOnDetails);
            }
          });
        });
      };

      const saleExchangeDetails = async (saleExchange) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_exchange WHERE sale_id ='${saleExchange}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, exchangeDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeDetails);
            }
          });
        });
      };

      const salePriceDetails = async (salePrice) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_price_details WHERE sale_id ='${salePrice}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, priceDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(priceDetails);
            }
          });
        });
      };

      const searchUniqueSaleQuery = `SELECT * FROM sale_details WHERE user_mobile='${search_input}' OR sale_id='${search_input}' AND sale_ifdeleted='0'`;

      database.query(searchUniqueSaleQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some internal issues.",
            err,
          });
        } else {
          if (results.length === 0) {
            res.status(200).json({
              success: false,
              message:
                "There is no sale registered on This mobile number or sale id.",
            });
          } else {
            for (let i = 0; i < results.length; i++) {
              var customer = results[i].user_id;
              results[i].customerDetails = await customerDetails(customer);

              const saleAddOns = results[i].sale_id;
              results[i].addOnDetails = await saleAddOnDetails(saleAddOns);

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const salePrice = results[i].sale_id;
              results[i].priceDetails = await salePriceDetails(salePrice);
            }
            res.status(200).json({
              success: true,
              message: "Sale found succesfully.",
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

// SALES LIST
sales.post("/list", (req, res) => {
  try {
    const salesCount = req.body.sales_count;
    const salesStatus = req.body.sales_status;

    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const customerDetails = async (customer) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM customers WHERE user_id ='${customer}' AND user_ifdeleted='0'`;
          database.query(customerQuery, (err, customerDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(customerDetails);
            }
          });
        });
      };

      const saleAddOnDetails = async (saleAddOns) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_addons WHERE sale_id ='${saleAddOns}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, addOnDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(addOnDetails);
            }
          });
        });
      };

      const saleExchangeDetails = async (saleExchange) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_exchange WHERE sale_id ='${saleExchange}' AND sale_ifdeleted='0' `;
          database.query(customerQuery, (err, exchangeDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeDetails);
            }
          });
        });
      };

      const salePriceDetails = async (salePrice) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_price_details WHERE sale_id ='${salePrice}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, priceDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(priceDetails);
            }
          });
        });
      };

      let salesQuery = `SELECT * FROM sale_details WHERE sale_ifdeleted='0'`;

      // SALE STATUS
      if (salesStatus != null || '' || undefined) {
        salesQuery += ` AND sale_status='${salesStatus}'`;
      }else{
        salesQuery += ``
      }

      // SALE COUNT
      if (salesCount != null || undefined || '') {
        salesQuery += ` ORDER BY id DESC LIMIT ${salesCount}`;
      }else{
        salesQuery += ``
      }

      console.log(salesQuery);

      // Database Query which takes above conditions and implements them.
      database.query(salesQuery, async (err, saleResults) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some internal errors.",
            err,
          });
        } else {
          if (saleResults.length == 0) {
            res.status(200).json({
              success: true,
              message: "Sales are Empty",
            });
          } else {
            for (let i = 0; i < saleResults.length; i++) {
              const customer = saleResults[i].user_id;
              saleResults[i].customerDetails = await customerDetails(customer);

              const saleAddOns = saleResults[i].sale_id;
              saleResults[i].addOnDetails = await saleAddOnDetails(saleAddOns);

              const saleExchange = saleResults[i].sale_id;
              saleResults[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const salePrice = saleResults[i].sale_id;
              saleResults[i].priceDetails = await salePriceDetails(salePrice);
            }
            res.status(200).json({
              success: true,
              message: "Succesfully found the Sales",
              saleResults,
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

module.exports = sales;
