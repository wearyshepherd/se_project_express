const { BadRequestError } = require("../utils/errors/BadRequestError");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { ForbiddenError } = require("../utils/errors/ForbiddenError");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { ConflictError } = require("../utils/errors/ConflictError");

const errorHandler = (err, req, res) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  } else if (err instanceof ConflictError) {
    statusCode = 409;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
