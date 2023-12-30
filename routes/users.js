const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { BadRequestError } = require("../utils/errors/BadRequestError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { ServerError } = require("../utils/errors/ServerError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { ConflictError } = require("../utils/errors/ConflictError");

const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(new BadRequestError("All fields are required"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email is already in use"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, avatar, email, password: hashedPassword });

    const savedUser = await newUser.save();

    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      avatar: savedUser.avatar,
      email: savedUser.email,
    };

    res.status(200).send({ data: userResponse });
    return null;
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new BadRequestError("Validation error"));
    }
    return next(new ServerError("Error from createUser"));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new UnauthorizedError("Invalid email or password"));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(new UnauthorizedError("Invalid email or password"));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({ token });
    return null;
  } catch (e) {
    return next(new ServerError("Error from login controller"));
  }
};

const getCurrentUser = (req, res, next) => {
  const loggedInUserId = req.user._id;

  User.findById(loggedInUserId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(new ServerError("Error from getCurrentUser"));
    });
};

const updateUserProfile = async (req, res, next) => {
  const { name, avatar } = req.body;
  const loggedInUserId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      { name, avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(new NotFoundError("User not found"));
    }

    res.status(200).send({ data: updatedUser });
    return null;
  } catch (e) {
    if (e.name === "ValidationError") {
      return next(new BadRequestError("Validation error"));
    }
    if (e.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(new ServerError("Error from updateUserProfile"));
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
