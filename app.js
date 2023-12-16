const express = require("express");
const helmet = require("helmet");

const app = express();
const mongoose = require("mongoose");
const routes = require("./routes");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: "65695ff308ed995278dcee3c",
  };
  next();
});

app.use("/", routes);

const { PORT = 3001 } = process.env;

app.listen(PORT);
