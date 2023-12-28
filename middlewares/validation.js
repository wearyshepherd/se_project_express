const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isUrl(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const validateAddClothingItem = celebrate({
  body: {
    itemName: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
  },
});

const validateNewUser = celebrate({
  body: {
    userName: Joi.string().required().min(2).max(30),
    userAvatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
});

const validateUserLogin = celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
});

const validateIdParam = celebrate({
  params: {
    id: Joi.string().hex().length(24).required(),
  },
});

const validateId = celebrate({
  params: Joi.object()
    .keys({
      itemId: Joi.string().hex().length(24).required(),
      userId: Joi.string().hex().length(24).required(),
    })
    .options({ allowUnknown: true }),
});

module.exports = {
  validateAddClothingItem,
  validateNewUser,
  validateUserLogin,
  validateIdParam,
  validateUrl,
  validateId,
};
