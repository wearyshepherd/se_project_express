const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const updateUserProfileSchema = {
  [Segments.BODY]: {
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (!validator.isURL(value)) {
        return helpers.message("Invalid URI format");
      }
      return value;
    }),
  },
};

router.get("/me", authMiddleware, getCurrentUser);
router.patch(
  "/me",
  authMiddleware,
  celebrate(updateUserProfileSchema),
  updateUserProfile,
);

module.exports = router;
