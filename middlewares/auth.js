const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized");
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (e) {
    throw new UnauthorizedError("Unauthorized");
  }
};

module.exports = authMiddleware;
