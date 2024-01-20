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

// Suppress the deprecation warning for `strictQuery`
mongoose.set('strictQuery', false);

// Log the value of MONGODB_URI
console.log("MONGODB_URI:", MONGODB_URI);

// MongoDB connection
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

app.use(cors());
app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Validation schemas
const signupValidation = celebrate({
  body: Joi.object({
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
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

// Middleware
app.use(requestLogger);

// Routes
app.post("/signup", signupValidation, createUser);
app.post("/signin", signinValidation, login);

app.use(routes);

// Error handling middleware
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
