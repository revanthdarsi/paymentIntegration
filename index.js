const express = require("express");
const ejs = require("ejs");

const Port = 5000 || process.env.Port;
const dotEnv = require("dotenv");
dotEnv.config();

const routes = require("./routes/pay");

const app = new express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("app");
});

app.use("/paypal", routes);

app.listen(Port, (err, cb) => {
  if (err) {
    console.log("Error Listening to Port");
  }
  console.log(`Server Started At ${Port}`);
});
