const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { UNAUTHORIZED } = require('../utils/errors');

const authMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send({ message: 'Unauthorized' });
  }

  const token = authorizationHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (e) {
    return res.status(UNAUTHORIZED).send({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
