const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
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
