const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./users");
const authMiddleware = require("../middlewares/auth");
const { NotFoundError } = require("../utils/errors/NotFoundError");

router.use("/items", clothingItem);
router.use("/users", authMiddleware, user);

router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;

