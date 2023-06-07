const express = require("express");
const sales = express.Router();
const jwt = require("jsonwebtoken");
const database = require("../../Configure/Database");
const paymentLink = require("../../Helper/paymentLink");
const dateForToday = require("../../Helper/dateCreater");

// SINGLE SALE v1
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

      const saleProductDetails = async (saleId) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_product_details WHERE sale_id ='${saleId}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, productDetails) => {
            if (err) {
              reject(err);
            } else {
              for (let j = 0; j < productDetails.length; j++) {
                const test = productDetails[j].stock_id;

                const stockQuery = `SELECT * FROM stocks WHERE stock_id='${test}' AND stock_ifdeleted='0'`;
                database.query(stockQuery, (Err, stockDetails) => {
                  if (Err) {
                    reject(Err);
                  } else {
                    productDetails[j].stockDetails = stockDetails;
                    resolve(productDetails);
                    resolve(stockDetails);
                  }
                });
              }
            }
          });
        });
      };
      const saleStockDetails = async (stockId) => {
        return new Promise((resolve, reject) => {
          const stockQuery = `SELECT * FROM stocks WHERE stock_id='${stockId}' AND stock_ifdeleted='0'`;
          database.query(stockQuery, (Err, stockDetails) => {
            if (Err) {
              reject(Err);
            } else {
              resolve(stockDetails);
            }
          });
        });
      };

      const salesQuery = `SELECT * FROM sale_price_details WHERE sale_id='${saleId}' AND sale_ifdeleted='0' `;

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

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const saleId = results[i].sale_id;

              const product = await saleProductDetails(saleId);
              const stocks = await saleStockDetails(product[i].stock_id);

              // product[i].stockDetails = stocks

              results[i].productDetails = product;
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
      message: "internalServerError",
      error,
    });
  }
});

// GET CUSTOMERS DUES v1
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

      const saleProductDetails = async (saleId) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_product_details WHERE sale_id ='${saleId}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, productDetails) => {
            if (err) {
              reject(err);
            } else {
              for (let j = 0; j < productDetails.length; j++) {
                const test = productDetails[j].stock_id;

                const stockQuery = `SELECT * FROM stocks WHERE stock_id='${test}' AND stock_ifdeleted='0'`;
                database.query(stockQuery, (Err, stockDetails) => {
                  if (Err) {
                    reject(Err);
                  } else {
                    productDetails[j].stockDetails = stockDetails;
                    resolve(productDetails);
                    resolve(stockDetails);
                  }
                });
              }
            }
          });
        });
      };
      const saleStockDetails = async (stockId) => {
        return new Promise((resolve, reject) => {
          const stockQuery = `SELECT * FROM stocks WHERE stock_id='${stockId}' AND stock_ifdeleted='0'`;
          database.query(stockQuery, (Err, stockDetails) => {
            if (Err) {
              reject(Err);
            } else {
              resolve(stockDetails);
            }
          });
        });
      };
      const dueSalesQuery = `SELECT * FROM sale_price_details WHERE sale_status='0' AND sale_ifdeleted ='0'`;

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

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const saleId = results[i].sale_id;

              const product = await saleProductDetails(saleId);
              const stocks = await saleStockDetails(product[i].stock_id);

              // product[i].stockDetails = stocks

              results[i].productDetails = product;
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
      message: "internalServerError",
      error,
    });
  }
});

// GET CUSTOMERS PAID v1
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
      const saleProductDetails = async (saleId) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_product_details WHERE sale_id ='${saleId}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, productDetails) => {
            if (err) {
              reject(err);
            } else {
              for (let j = 0; j < productDetails.length; j++) {
                const test = productDetails[j].stock_id;

                const stockQuery = `SELECT * FROM stocks WHERE stock_id='${test}' AND stock_ifdeleted='0'`;
                database.query(stockQuery, (Err, stockDetails) => {
                  if (Err) {
                    reject(Err);
                  } else {
                    productDetails[j].stockDetails = stockDetails;
                    resolve(productDetails);
                    resolve(stockDetails);
                  }
                });
              }
            }
          });
        });
      };
      const saleStockDetails = async (stockId) => {
        return new Promise((resolve, reject) => {
          const stockQuery = `SELECT * FROM stocks WHERE stock_id='${stockId}' AND stock_ifdeleted='0'`;
          database.query(stockQuery, (Err, stockDetails) => {
            if (Err) {
              reject(Err);
            } else {
              resolve(stockDetails);
            }
          });
        });
      };

      const dueSalesQuery = `SELECT * FROM sale_price_details WHERE sale_status='1' AND sale_ifdeleted ='0'`;

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

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const saleId = results[i].sale_id;

              const product = await saleProductDetails(saleId);
              const stocks = await saleStockDetails(product[i].stock_id);

              // product[i].stockDetails = stocks

              results[i].productDetails = product;
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
      message: "internalServerError",
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
      const saleDetailsUpdate = async (
        id,
        stockid,
        sale_id,
        productName,
        oneGmPrice,
        noOfGms,
        wastageGms,
        meltingAt,
        purityAt,
        makingAmt,
        stoneAmt,
        totalAmt
      ) => {
        return new Promise((resolve, reject) => {
          const saleProductQuery = `UPDATE sale_product_details SET product_name='${productName}', one_gm_price='${oneGmPrice}',
          no_of_gms='${noOfGms}', wastage_gms='${wastageGms}', melting_at='${meltingAt}', purity_at='${purityAt}',
          making_amount='${makingAmt}', stones_amount='${stoneAmt}', total_amount='${totalAmt}'
           WHERE sale_id='${sale_id}' AND stock_id='${stockid}' AND id='${id}'`;
          database.query(saleProductQuery, (err, saleDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(saleDetails);
            }
          });
        });
      };

      const saleExchangeUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const exchangeQuery = `UPDATE sale_exchange SET ex_product_name='${req.body.exchange_products_name}',
            ex_one_gm_rate='${req.body.exchange_rate_one_gram}', ex_purity='${req.body.exchange_purity_at}', ex_netwt='${req.body.exchange_net_weight}',
             melting='${req.body.exchange_melting_at}', ex_gms_wt='${req.body.exchange_grams_weight}', ex_amount='${req.body.exchange_total_amount}' 
             WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
          database.query(exchangeQuery, (err, exchangeResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeResults);
            }
          });
        });
      };

      const salePriceDetailsUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const pricedetailsQuery = `UPDATE sale_price_details SET total_price='${req.body.order_total_amount}',tax_at='${req.body.tax_rate_at}',
          tax_total='${req.body.order_tax_total_amount}', total_after_tax='${req.body.order_total_after_tax}',extra_product_desc='${req.body.extra_product_desc}',
          extra_product_amount='${req.body.extra_product_amount}',discount_amount='${req.body.order_discount_amount}', payment_method='${req.body.payment_method}',
          ex_amount='${req.body.exchange_total_amount}',paid_amount='${req.body.paid_amount}',grand_total='${req.body.order_grand_total}',
          due_amount='${req.body.due_amount}' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;

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
            )}', '${req.body.user_id}', '${req.body.user_mobile}',
             '${saleId}', '${req.body.order_grand_total}', '${
              req.body.txn_paid_amount
            }', '${req.body.due_amount}', '${req.body.payment_method}',
             '0', '0', '${dateForToday}')`;

            database.query(txnQueryPaid, (err, txnResults) => {
              if (err) {
                reject(err);
              } else {
                resolve(txnResults);
              }
            });
          }

          if (req.body.due_amount == 0) {
            const updateSaleDetailsStatusQuery = `UPDATE sale_product_details SET sale_status='1' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
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
          } else {
            const updateSaleDetailsStatusQuery = `UPDATE sale_product_details SET sale_status='0' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
            database.query(updateSaleDetailsStatusQuery, (err, Results) => {
              if (err) {
                reject(err);
              } else {
                const updateSalePriceStatusQuery = `UPDATE sale_price_details SET sale_status='0' WHERE sale_id='${saleId}' AND sale_ifdeleted='0'`;
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

      const saleDetailsQuery = `SELECT * FROM sale_product_details WHERE sale_id='${req.params.sale_id}' AND sale_ifdeleted='0'`;
      database.query(saleDetailsQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having technical issues.",
            err,
          });
        } else {
          if (results.length == 0) {
            res.status(200).json({
              success: false,
              message: "No sale found",
            });
          } else {
            const saleID = results[0].sale_id;
            await salePriceDetailsUpdate(saleID);
            await saleExchangeUpdate(saleID);

            for (let i = 0; i < req.body.cart_products.length; i++) {
              await saleDetailsUpdate(
                req.body.cart_products[i].id,
                req.body.cart_products[i].stock_id,
                results[0].sale_id,
                req.body.cart_products[i].product_name,
                req.body.cart_products[i].one_gram_price,
                req.body.cart_products[i].no_of_grams,
                req.body.cart_products[i].wastage_grams,
                req.body.cart_products[i].melting_at,
                req.body.cart_products[i].purity_at,
                req.body.cart_products[i].making_amount,
                req.body.cart_products[i].stones_amount,
                req.body.cart_products[i].total_amount
              );
            }

            res.status(200).json({
              success: true,
              message: "Sale updated succcesfully",
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

// DELETE SALE v1
sales.delete("/delete/:sale_id", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const saleDetailsUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const addonsQuery = `UPDATE sale_product_details SET sale_ifdeleted='1' WHERE sale_id='${saleId}'`;
          database.query(addonsQuery, (err, saleDetails) => {
            if (err) {
              reject(err);
            } else {
              resolve(saleDetails);
            }
          });
        });
      };

      const saleExchangeUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const exchangeQuery = `UPDATE sale_exchange SET sale_ifdeleted='1' WHERE sale_id='${saleId}'`;
          database.query(exchangeQuery, (err, exchangeResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeResults);
            }
          });
        });
      };

      const salePriceDetailsUpdate = async (saleId) => {
        return new Promise((resolve, reject) => {
          const pricedetailsQuery = `UPDATE sale_price_details SET sale_ifdeleted='1' WHERE sale_id='${saleId}'`;

          database.query(pricedetailsQuery, (err, pricedetailsResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(pricedetailsResults);
            }
          });
        });
      };

      const updateTxnDetails = async (saleId) => {
        return new Promise((resolve, reject) => {
          const txnQueryPaid = `UPDATE txn_details SET txn_ifdeleted='1' WHERE sale_id='${saleId}'`;
          database.query(txnQueryPaid, (err, txnResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(txnResults);
            }
          });
        });
      };

      const saleDetailsQuery = `SELECT * FROM sale_product_details WHERE sale_id='${req.params.sale_id}' AND sale_ifdeleted='0'`;
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
            await saleDetailsUpdate(saleID);
            await saleExchangeUpdate(saleID);
            await salePriceDetailsUpdate(saleID);
            await updateTxnDetails(saleID);

            res.status(200).json({
              success: true,
              message: "Sale Deleted succcesfully",
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

// SALE CREATE v1
sales.post("/create", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);
    if (verify) {
      const exchangeSale = async (randomNumber, customerID) => {
        return new Promise((resolve, reject) => {
          const exchangeQuery = `INSERT INTO sale_exchange(sale_id, user_id, ex_product_name, ex_one_gm_rate, ex_purity, ex_netwt, melting, ex_gms_wt,
           ex_amount, sale_status, sale_ifdeleted, created)
              VALUES ('${randomNumber}', '${customerID}','${req.body.exchange_products_name}', '${req.body.exchange_rate_one_gram}',
              '${req.body.exchange_purity_at}','${req.body.exchange_net_weight}','${req.body.exchange_melting_at}', '${req.body.exchange_grams_weight}',
              '${req.body.exchange_total_amount}', '0', '0','${dateForToday}')`;

          database.query(exchangeQuery, (err, exchangeResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(exchangeResults);
            }
          });
        });
      };

      const salePriceDetails = async (randomNumber, customer, mobile) => {
        return new Promise((resolve, reject) => {
          const pricedetailsQuery = `INSERT INTO sale_price_details(sale_id, user_id, user_name, user_mobile, total_price, tax_at, tax_total, total_after_tax, 
          extra_product_desc, extra_product_amount, discount_amount, payment_method, flatform_charges, ex_amount,
           paid_amount, grand_total, due_amount, sale_status, sale_ifdeleted, created) 
            VALUES ('${randomNumber}', '${customer}', '${req.body.user_name}', '${mobile}', '${req.body.order_total_amount}', '${req.body.tax_rate_at}',
            '${req.body.order_tax_total_amount}','${req.body.order_total_after_tax}', '${req.body.extra_product_desc}', '${req.body.extra_product_amount}',
            '${req.body.order_discount_amount}', '${req.body.payment_method}','${req.body.flatform_charges}', '${req.body.exchange_total_amount}', 
            '${req.body.paid_amount}', '${req.body.order_grand_total}', '${req.body.due_amount}', '0', '0','${dateForToday}' )`;

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
            )}', '${customer}', '${req.body.user_mobile}', 
            '${randomNumber}', '${req.body.order_grand_total}', '${
              req.body.txn_paid_amount
            }', '${req.body.due_amount}', '${
              req.body.payment_method
            }', '0', '0', '${dateForToday}')`;
            database.query(txnQueryPaid, (err, txnResults) => {
              if (err) {
                reject(err);
              } else {
                resolve(txnResults);
              }
            });
          }

          if (req.body.due_amount == 0) {
            if (req.body.paid_amount == req.body.order_grand_total) {
              const updateSaleDetailsStatusQuery = `UPDATE sale_product_details SET sale_status='1' WHERE sale_id='${randomNumber}' `;
              database.query(
                updateSaleDetailsStatusQuery,
                (err, dueResults) => {
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
                }
              );
            }
          }
        });
      };

      // const sharePaymentLink = async (
      //   customer,
      //   customerMobile,
      //   randomNumber,
      //   due_amount
      // ) => {
      //   return new Promise((resolve, reject) => {
      //     const customerSqlQuery = `SELECT * FROM customers WHERE user_id='${customer}' OR user_mobile='${customerMobile}' AND user_ifdeleted='0'`;
      //     database.query(customerSqlQuery, (err, userResults) => {
      //       if (err) {
      //         reject(err);
      //       } else {
      //         if (userResults.length === 0) {
      //           resolve("User not found on those details.");
      //         } else {
      //           const options = {
      //             name: userResults[0].user_name,
      //             email: userResults[0].user_email,
      //             contact: userResults[0].user_mobile,
      //             user_id: userResults[0].user_id,
      //             sale_id: randomNumber,
      //             product_name: req.body.product_name,
      //             grand_total: req.body.grand_total,
      //             no_of_grams: req.body.no_of_grams,
      //           };

      //           const Desc =
      //             "Dues for your" +
      //             " " +
      //             req.body.product_name +
      //             " " +
      //             "Thankyou.";
      //           paymentLink(due_amount, options, Desc);
      //           resolve(userResults);
      //         }
      //       }
      //     });
      //   });
      // };

      const saleFunctonsWorkPromises = async (
        randomNumber,
        customerId,
        customerMobile,
        stockId,
        productName,
        oneGmPrice,
        noOfGms,
        wastageGms,
        meltingAt,
        purityAt,
        makingAmt,
        stoneAmt,
        totalAmt,
        date
      ) => {
        return new Promise((resolve, reject) => {
          let txnMethod = req.body.payment_method;

          const due_amount = req.body.due_amount;

          if (txnMethod == "O") {
            txnMethod = (due_amount * 2.2) / 100;
          } else {
            txnMethod = 0;
          }

          const detailsQuery = `INSERT INTO sale_product_details(sale_id, user_id, user_mobile, stock_id, product_name, one_gm_price, no_of_gms, 
            wastage_gms, melting_at, purity_at, making_amount, stones_amount, total_amount, sale_status, sale_ifdeleted, created)
                 VALUES ('${randomNumber}', '${customerId}','${customerMobile}','${stockId}', '${productName}',
                 '${oneGmPrice}', '${noOfGms}','${wastageGms}', '${meltingAt}', '${purityAt}',
                  '${makingAmt}','${stoneAmt}', '${totalAmt}', '0', '0', '${date}')`;
          database.query(detailsQuery, async (err, saleResults) => {
            if (err) {
              reject(err);
            } else {
              resolve(saleResults);
            }
          });
        });
      };

      const stockUpdate = async (stockId, stock_available_gms) => {
        return new Promise((resolve, reject) => {
          const stockQuery = `UPDATE stocks SET stock_available='${stock_available_gms}' WHERE stock_id='${stockId}' AND stock_ifdeleted='0'`;
          database.query(stockQuery, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
      };

      const randomNumber = Math.floor(10000000 + Math.random() * 99999999);

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
            const customerID = Math.floor(1000000 + Math.random() * 9999999);

            const customerCreation = `INSERT INTO customers (user_id, user_name, user_mobile, user_email, user_address, user_status, user_ifdeleted, created)
            VALUES ('${customerID}', '${req.body.user_name}', '${req.body.user_mobile}', '${req.body.user_email}', '${req.body.user_address}', '0', '0', '${dateForToday}')`;
            database.query(customerCreation, async (err, customerResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having some internal issues",
                  err,
                });
              } else {
                for (let i = 0; i < req.body.cart_products.length; i++) {
                  await saleFunctonsWorkPromises(
                    randomNumber,
                    customerID,
                    req.body.user_mobile,
                    req.body.cart_products[i].stock_id,
                    req.body.cart_products[i].product_name,
                    req.body.cart_products[i].one_gram_price,
                    req.body.cart_products[i].no_of_grams,
                    req.body.cart_products[i].wastage_grams,
                    req.body.cart_products[i].melting_at,
                    req.body.cart_products[i].purity_at,
                    req.body.cart_products[i].making_amount,
                    req.body.cart_products[i].stones_amount,
                    req.body.cart_products[i].total_amount,
                    dateForToday
                  );

                  await stockUpdate(
                    req.body.cart_products[i].stock_id,
                    req.body.cart_products[i].stock_available_gms
                  );
                }

                exchangeSale(randomNumber, customerID);

                salePriceDetails(
                  randomNumber,
                  customerID,
                  req.body.user_mobile
                );

                res.status(200).json({
                  success: true,
                  message: "Successfully created sale.",
                });
              }
            });
          } else {
            const takeCustomerID = checkingResults[0].user_id;
            const takeCustomerMobile = checkingResults[0].user_mobile;

            for (let i = 0; i < req.body.cart_products.length; i++) {
              await saleFunctonsWorkPromises(
                randomNumber,
                takeCustomerID,
                takeCustomerMobile,
                req.body.cart_products[i].stock_id,
                req.body.cart_products[i].product_name,
                req.body.cart_products[i].one_gram_price,
                req.body.cart_products[i].no_of_grams,
                req.body.cart_products[i].wastage_grams,
                req.body.cart_products[i].melting_at,
                req.body.cart_products[i].purity_at,
                req.body.cart_products[i].making_amount,
                req.body.cart_products[i].stones_amount,
                req.body.cart_products[i].total_amount,
                dateForToday
              );

              await stockUpdate(
                req.body.cart_products[i].stock_id,
                req.body.cart_products[i].stock_available_gms
              );
            }

            if ((req.body.exchange_products_name != undefined) | null) {
              if ((req.body.exchange_net_weight != undefined) | null) {
                exchangeSale(randomNumber, takeCustomerID);
              }
            }

            salePriceDetails(randomNumber, takeCustomerID, takeCustomerMobile);

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
      message: "internalServerError",
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

      const todayQuery = `SELECT * FROM sale_price_details WHERE sale_ifdeleted='0'`;
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
            const todayQuery = `SELECT COUNT(sale_id) AS today_count FROM sale_price_details WHERE created ='${dateForToday}' AND sale_ifdeleted='0'`;
            database.query(todayQuery, async (err, todayResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having internal issues while conecting.",
                  err,
                });
              } else {
                const allSalesQuery = `SELECT COUNT(sale_id) AS total_count FROM sale_price_details WHERE sale_ifdeleted='0'`;
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
      message: "internalServerError",
      error,
    });
  }
});

// SEARCH SALE WITH ID OR MOBILE v1
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

      const saleProductDetails = async (saleId) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_product_details WHERE sale_id ='${saleId}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, productDetails) => {
            if (err) {
              reject(err);
            } else {
              for (let j = 0; j < productDetails.length; j++) {
                const test = productDetails[j].stock_id;

                const stockQuery = `SELECT * FROM stocks WHERE stock_id='${test}' AND stock_ifdeleted='0'`;
                database.query(stockQuery, (Err, stockDetails) => {
                  if (Err) {
                    reject(Err);
                  } else {
                    productDetails[j].stockDetails = stockDetails;
                    resolve(productDetails);
                    resolve(stockDetails);
                  }
                });
              }
            }
          });
        });
      };
      const saleStockDetails = async (stockId) => {
        return new Promise((resolve, reject) => {
          const stockQuery = `SELECT * FROM stocks WHERE stock_id='${stockId}' AND stock_ifdeleted='0'`;
          database.query(stockQuery, (Err, stockDetails) => {
            if (Err) {
              reject(Err);
            } else {
              resolve(stockDetails);
            }
          });
        });
      };

      const searchUniqueSaleQuery = `SELECT * FROM sale_price_details WHERE user_mobile='${search_input}' OR sale_id='${search_input}' AND sale_ifdeleted='0'`;

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

              const saleExchange = results[i].sale_id;
              results[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );
              const saleId = results[i].sale_id;

              const product = await saleProductDetails(saleId);
              const stocks = await saleStockDetails(product[i].stock_id);
              results[i].productDetails = product;
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
      message: "internalServerError",
      error,
    });
  }
});

// SEARCH SALE WITH ID OR MOBILE v1
sales.post("/due/getdues", (req, res) => {
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

      const saleProductDetails = async (saleId) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_product_details WHERE sale_id ='${saleId}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, productDetails) => {
            if (err) {
              reject(err);
            } else {
              for (let j = 0; j < productDetails.length; j++) {
                const test = productDetails[j].stock_id;

                const stockQuery = `SELECT * FROM stocks WHERE stock_id='${test}' AND stock_ifdeleted='0'`;
                database.query(stockQuery, (Err, stockDetails) => {
                  if (Err) {
                    reject(Err);
                  } else {
                    productDetails[j].stockDetails = stockDetails;
                    resolve(productDetails);
                    resolve(stockDetails);
                  }
                });
              }
            }
          });
        });
      };
      const saleStockDetails = async (stockId) => {
        return new Promise((resolve, reject) => {
          const stockQuery = `SELECT * FROM stocks WHERE stock_id='${stockId}' AND stock_ifdeleted='0'`;
          database.query(stockQuery, (Err, stockDetails) => {
            if (Err) {
              reject(Err);
            } else {
              resolve(stockDetails);
            }
          });
        });
      };

      const searchUniqueSaleQuery = `SELECT * FROM sale_price_details WHERE user_mobile='${search_input}' OR sale_id='${search_input}' AND sale_ifdeleted='0'`;

      database.query(searchUniqueSaleQuery, async (err, results) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: "Having some internal issues.",
            err,
          });
        } else {
          if (results.length == 0) {
            res.status(200).json({
              success: false,
              message:
                "There is no dues registered on This mobile number or sale id.",
            });
          } else {
            const dueSaleWithSearch = `SELECT * FROM sale_price_details WHERE sale_status='0'`;
            database.query(dueSaleWithSearch, async (err, dueResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having some technical issues",
                  err,
                });
              } else {
                if (dueResults.length == 0) {
                  res.status(200).json({
                    success: false,
                    message:
                      "There is no due sale registered on This mobile number or sale id.",
                  });
                } else {
                  for (let i = 0; i < dueResults.length; i++) {
                    var customer = dueResults[i].user_id;
                    dueResults[i].customerDetails = await customerDetails(
                      customer
                    );

                    const saleExchange = dueResults[i].sale_id;
                    dueResults[i].exchangeDetails = await saleExchangeDetails(
                      saleExchange
                    );

                    const saleId = dueResults[i].sale_id;

                    const product = await saleProductDetails(saleId);
                    const stocks = await saleStockDetails(product[i].stock_id);
                    dueResults[i].productDetails = product;
                  }
                  res.status(200).json({
                    success: true,
                    message: "Sale found succesfully.",
                    dueResults,
                  });
                }
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
      message: "internalServerError",
      error,
    });
  }
});

// SALES LIST v1
sales.post("/list", (req, res) => {
  try {
    const headerkey = process.env.JWT_HEADER_KEY;
    const securekey = process.env.JWT_SECURE_KEY;

    const header = req.header(headerkey);
    const verify = jwt.verify(header, securekey);

    if (verify) {
      const salesCount = req.body.sales_count;
      const salesStatus = req.body.sales_status;

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

      const saleProductDetails = async (saleId) => {
        return new Promise((resolve, reject) => {
          const customerQuery = `SELECT * FROM sale_product_details WHERE sale_id ='${saleId}' AND sale_ifdeleted='0'`;
          database.query(customerQuery, (err, productDetails) => {
            if (err) {
              reject(err);
            } else {
              for (let j = 0; j < productDetails.length; j++) {
                const test = productDetails[j].stock_id;

                const stockQuery = `SELECT * FROM stocks WHERE stock_id='${test}' AND stock_ifdeleted='0'`;
                database.query(stockQuery, (Err, stockDetails) => {
                  if (Err) {
                    reject(Err);
                  } else {
                    productDetails[j].stockDetails = stockDetails;
                    resolve(productDetails);
                    resolve(stockDetails);
                  }
                });
              }
            }
          });
        });
      };
      const saleStockDetails = async (stockId) => {
        return new Promise((resolve, reject) => {
          const stockQuery = `SELECT * FROM stocks WHERE stock_id='${stockId}' AND stock_ifdeleted='0'`;
          database.query(stockQuery, (Err, stockDetails) => {
            if (Err) {
              reject(Err);
            } else {
              resolve(stockDetails);
            }
          });
        });
      };

      let salesQuery = `SELECT * FROM sale_price_details WHERE sale_ifdeleted='0'`;

      // SALE STATUS
      if ((salesStatus != null) | "" | undefined) {
        salesQuery += ` AND sale_status='${salesStatus}'`;
      } else {
        salesQuery += ``;
      }

      // SALE COUNT
      if ((salesCount != null) | undefined | "") {
        salesQuery += ` ORDER BY id DESC LIMIT ${salesCount}`;
      } else {
        salesQuery += ` ORDER BY id DESC`;
      }

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

              const saleExchange = saleResults[i].sale_id;
              saleResults[i].exchangeDetails = await saleExchangeDetails(
                saleExchange
              );

              const saleId = saleResults[i].sale_id;

              const product = await saleProductDetails(saleId);
              const stocks = await saleStockDetails(product[i].stock_id);

              saleResults[i].productDetails = product;
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
      message: "internalServerError",
      error,
    });
  }
});

module.exports = sales;
