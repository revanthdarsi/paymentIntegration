const express = require("express");
const router = express.Router();
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: process.env.MODE === "dev" ? "sandbox" : "live", //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

router.post("/pay", (req, res) => {
  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:${process.env.PORT}/paypal/success`,
        cancel_url: `http://localhost:${process.env.PORT}/paypal/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Samsung Galaxy Fold",
                sku: "0001",
                price: "750.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "750.00",
          },
          description: "The Best Folding Mobile In The Marker",
        },
      ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  } catch (err) {
    console.log("Error In Pay Route");
    console.error(err);
  }
});

router.get("/success", (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "750.00",
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          res.status(200).send("Payment Successfull");
        }
      }
    );
  } catch (err) {
    console.log("Error In Success Route");
    console.error(err);
  }
});

router.get("/cancel", (req, res) => {
  res.status(200).send("Payment Cancelled");
});

module.exports = router;
