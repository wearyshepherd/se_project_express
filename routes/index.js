const router = require("express").Router();
// const clothingItem = require("./clothingItem");
// const user = require("./users");
const authMiddleware = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");

router.use(authMiddleware);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
