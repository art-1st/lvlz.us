const dotenv = require('dotenv');

dotenv.config();

module.exports.env = () => ({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  NCP_AI_CLIENT_ID: process.env.NCP_AI_CLIENT_ID,
  NCP_AI_CLIENT_SECRET: process.env.NCP_AI_CLIENT_SECRET
});