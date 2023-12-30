const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

const itemValidationSchema = {
  body: Joi.object({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!validator.isURL(value)) {
          return helpers.message("Invalid URL format");
        }
        return value;
      }),
  }),
};

const itemIdValidationSchema = {
  [Segments.PARAMS]: {
    itemId: Joi.string().required().length(24).hex(),
  },
};

// CRUD

// Create
router.post("/", authMiddleware, celebrate(itemValidationSchema), createItem);

// Read
router.get("/", getItems);

// Delete
router.delete(
  "/:itemId",
  authMiddleware,
  celebrate(itemIdValidationSchema),
  deleteItem,
);

// Like
router.put(
  "/:itemId/likes",
  authMiddleware,
  celebrate(itemIdValidationSchema),
  likeItem,
);

// Unlike
router.delete(
  "/:itemId/likes",
  authMiddleware,
  celebrate(itemIdValidationSchema),
  unlikeItem,
);

module.exports = router;
