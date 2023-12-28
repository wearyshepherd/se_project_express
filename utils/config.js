const crypto = require('crypto');

module.exports = {
  JWT_SECRET: crypto.randomBytes(30).toString('hex'),
}