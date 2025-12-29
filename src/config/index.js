require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET ,
  JWT_EXPIRE: process.env.JWT_EXPIRE ,

  // Houses Server
  HOUSES_SERVER_URL: process.env.HOUSES_SERVER_URL,
};
