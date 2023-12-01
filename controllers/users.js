const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BAD_REQUEST, UNAUTHORIZED, CONFLICT, SERVER_ERROR, NOT_FOUND } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(CONFLICT).send({ message: "Email is already in use" });
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

    return res.status(200).send({ data: userResponse });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: "Validation error" });
    }
    return res.status(SERVER_ERROR).send({ message: "Error from createUser" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(UNAUTHORIZED).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).send({ token });
  } catch (e) {
    return res.status(SERVER_ERROR).send({ message: "Error from login controller" });
  }
};

const getCurrentUser = (req, res) => {
  const loggedInUserId = req.user._id;

  return User.findById(loggedInUserId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
      }
      return res.status(SERVER_ERROR).send({ message: "Error from getCurrentUser" });
    });
};

const updateUserProfile = async (req, res) => {
  const { name, avatar } = req.body;
  const loggedInUserId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUserId,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    return res.status(200).send({ data: updatedUser });
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Validation error" });
    }
    if (e.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
    }
    return res.status(SERVER_ERROR).send({ message: "Error from updateUserProfile" });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile
};

