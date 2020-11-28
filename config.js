require('dotenv').config();

module.exports = {
  secret: process.env.SECRETKEY,
  expiresIn: process.env.EXPIRESIN
};
