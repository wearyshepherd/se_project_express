require('dotenv').config();

const { JWT_SECRET = 'Sunnydays13' } = process.env;

module.exports = {
  JWT_SECRET,
};
