require("dotenv").config();
console.log("All Environment Variables:", process.env);

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
const { PORT = 3001, MONGODB_URI } = process.env;

mongoose.set('strictQuery', false);

console.log("MONGODB_URI:", MONGODB_URI);

app.use(cors());

mongoose
  .connect(MONGODB_URI || "mongodb://localhost:27017/yourdevdatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

const signupValidation = celebrate({
  // ... your existing validation schema
});

const signinValidation = celebrate({
  // ... your existing validation schema
});

app.use(requestLogger);

app.post("/signup", signupValidation, createUser);
app.post("/signin", signinValidation, login);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
