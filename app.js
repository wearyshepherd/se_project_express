require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const validator = require("validator");
const { errors } = require("celebrate");
const { celebrate, Joi } = require("celebrate");
const routes = require("./routes");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (e) => {
  if (e) {
    // console.error("DB error", e);
  }
});

app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Invalid URL format");
        }
        return value;
      }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

app.use(requestLogger);

app.post("/signup", signupValidation, createUser);
app.post("/signin", signinValidation, login);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // console.log(`App listening at port ${PORT}`);
});
