const Razorpay = require("razorpay");
const denv = require("dotenv");
const database = require("../Configure/Database");
const dateForToday = require("../Helper/dateCreater");

denv.config();

const instance = new Razorpay({
  key_id: process.env.RZP_KEY,
  key_secret: process.env.RZP_SECURE_KEY,
});

module.exports = function (dueAmount, details, Desc) {
  let refStringIds = (Math.random() + 1).toString(36).substring(7);
  const chargess = (dueAmount * 2.2) / 100;
  const dueAmountWithCharges = dueAmount + chargess

  const options = {
    amount: dueAmountWithCharges * 100,
    currency: "INR",
    accept_partial: false,
    description: Desc,
    customer: {
      name: details.name,
      email: details.email,
      contact: details.contact,
    },
    notify: {
      sms: true,
      email: true,
    },
    reminder_enable: true,
    reference_id: refStringIds,
    notes: {
      sale_id: details.sale_id,
      user_id: details.user_id,
      product: details.product_name,
      no_of_grams: details.no_of_grams,
      grand_total: details.grand_total,
      due_amount : dueAmount,
    },
    callback_method: process.env.CALLBACK_METHOD,
    callback_url: process.env.CALLBACK_URL,
  };

  instance.paymentLink.create(options, (err, results) => {
    if (err) {
      console.log(err);
    } else {

      const payQuery = `INSERT INTO online_payments(user_id, user_mobile, sale_id, sale_due_amount, flatform_charges,
             grand_total, pl_id, pl_payment_id, pl_signiture, pl_ref_id, pl_amount, pl_description, pl_created, pl_short_url,
              pl_paid, pl_paid_date_time, pl_payment_status, pl_payment_method, payment_status, payment_ifdeleted, created)
              VALUES ('${details.user_id}', '${details.contact}', '${details.sale_id}','${dueAmount}','${chargess}', 
      '${dueAmount + chargess}', '${results.id}', '', '','${results.reference_id}', '${results.amount / 100}',
       '${Desc}', '${results.created_at}', '${results.short_url}','${results.amount_paid / 100
      }', '${results.updated_at}', '${results.status}', 
      '', '0', '0', '${dateForToday}')`;
      database.query(payQuery, (err, payResults) => {
        if (err) {
          console.log(err);
        } else {
          console.log(results);
        }
      });
    }
  });
};
