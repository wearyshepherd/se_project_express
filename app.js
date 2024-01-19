require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const validator = require("validator");
const helmet = require("helmet");
const { errors } = require("celebrate");
const { celebrate, Joi } = require("celebrate");
const routes = require("./routes");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001, MONGODB_URI } = process.env;

// Check if MONGODB_URI is undefined
if (!MONGODB_URI) {
  console.error("MongoDB connection URI is not defined in the .env file");
  process.exit(1); // Exit the process
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(cors());
app.use(express.json());
app.use(helmet());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Validation middleware
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

// Logger middleware
app.use(requestLogger);

// Routes
app.post("/signup", signupValidation, createUser);
app.post("/signin", signinValidation, login);
app.use(routes);

// Error logger middleware
app.use(errorLogger);

// Celebrate middleware for handling validation errors
app.use(errors());

// Generic error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
