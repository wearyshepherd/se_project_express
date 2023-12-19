const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
