const express = require("express");
const pay = express.Router();
const Razorpay = require("razorpay");
const database = require("../../Configure/Database");
const {validatePaymentVerification} = require("razorpay/dist/utils/razorpay-utils");
const dateForToday = require("../../Helper/dateCreater");

pay.get("/verify", (req, res) => {
  try {
    const razorpay_payment_id = req.query.razorpay_payment_id;
    const razorpay_payment_link_id = req.query.razorpay_payment_link_id;
    const razorpay_payment_link_reference_id =
      req.query.razorpay_payment_link_reference_id;
    const razorpay_payment_link_status = req.query.razorpay_payment_link_status;
    const razorpay_signature = req.query.razorpay_signature;

    var instance = new Razorpay({
      key_id: process.env.RZP_KEY,
      key_secret: process.env.RZP_SECURE_KEY,
    });

    validatePaymentVerification(
      {
        payment_link_id: razorpay_payment_link_id,
        payment_id: razorpay_payment_id,
        payment_link_reference_id: razorpay_payment_link_reference_id,
        payment_link_status: razorpay_payment_link_status,
      },
      { razorpay_signature },
      process.env.RZP_SECURE_KEY
    );

    instance.paymentLink.fetch(razorpay_payment_link_id, (err, results) => {
      if (err) {
        res.json(err);
      } else {
        const onlinePAymentUpdate = `UPDATE online_payments SET pl_payment_id='${results.payments[0].payment_id
          }', pl_order_id='${results.order_id}',
         pl_signiture='${razorpay_signature}', pl_paid='${results.amount_paid / 100
          }',pl_paid_date_time='${results.updated_at}', pl_payment_status='${results.status
          }', 
          pl_payment_method='${results.payments[0].method
          }',payment_status='1' WHERE pl_id='${results.id}' AND sale_id='${results.notes.sale_id
          }'
         AND pl_short_url='${results.short_url}'`;
        database.query(onlinePAymentUpdate, (err, paymentResults) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: "Having internal issues.",
              err,
            });
          } else {
            let method = results.payments[0].method;
            if (method != "C" || "U") {
              method = "O";
            }
            const SalePriceDetails = `SELECT * FROM sale_price_details WHERE sale_id='${results.notes.sale_id}' AND user_id='${results.notes.user_id}'`;
            database.query(SalePriceDetails, (err, salePriceResults) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: "Having internal issues.",
                  err,
                });
              } else {
                if (salePriceResults === 0) {
                  res.status(400).json({
                    success: false,
                    message: "Sale price details not found.",
                  });
                } else {
                  const takingPaidAmount = salePriceResults[0].paid_amount;
                  const takingDueAmount = salePriceResults[0].due_amount;
                  const dueAmountTaking = results.notes.due_amount
                  const toNumber = parseInt(dueAmountTaking)

                  const updatePaid = takingPaidAmount + toNumber
                  const updateDue = takingDueAmount - toNumber

                  var saleStatusUpdate = ''

                  if (updateDue == 0) {
                    saleStatusUpdate += 1
                  } else {
                    saleStatusUpdate += 0
                  }

                  const updateSalePriceDetails = `UPDATE sale_price_details SET paid_amount ='${updatePaid}',
                   due_amount='${updateDue}', sale_status ='${saleStatusUpdate}'
                    WHERE sale_id='${results.notes.sale_id}' AND user_id='${results.notes.user_id
                    }' `;
                  database.query(
                    updateSalePriceDetails,
                    (err, priceResults) => {
                      if (err) {
                        res.status(400).json({
                          success: false,
                          message: "Having internal issues.",
                          err,
                        });
                      } else {
          const updateSaleDetails = `UPDATE sale_details SET sale_status ='${saleStatusUpdate}', payment_method ='${method}' WHERE sale_id='${results.notes.sale_id}'
            AND user_id='${results.notes.user_id}'`;
                        database.query(updateSaleDetails, (err, saleResults) => {
                          if (err) {
                            res.status(400).json({
                              success: false,
                              message: "Having internal issues.",
                              err,
                            });
                          } else {

                        const txnDetails = `INSERT INTO txn_details(txn_id, user_id, user_mobile, sale_id, order_total, 
                          txn_amount, order_due, txn_method,
            txn_status, txn_ifdeleted, date) VALUES('${Math.floor(
                            1000000 + Math.random() * 9999999
                          )}', '${results.notes.user_id}', '${
                          results.customer.contact
                        }',
                           '${results.notes.sale_id}','', '${
                          results.amount_paid / 100
                        }','', '${method}', '1', '0', '${dateForToday}')`;
                        database.query(txnDetails, (error, txnResults) => {
                          if (error) {
                            res.status(400).json({
                              success: false,
                              message: "Having internal errors.",
                              err,
                            });
                          } else {
                            res.status(200).json({
                              success: true,
                              message: "Succesfully verified payment, Thankyou.",
                              results,
                            });
                          }
                        });
                          }
                        });
                      }
                    }
                  );
                }
              }
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

module.exports = pay;
