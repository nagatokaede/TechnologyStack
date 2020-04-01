'use static';

const env = process.env;

module.exports = {
  NODE_ENV: env.NODE_ENV || 'development',
  PORT: env.PORT || '3000',
  MONGO_HOST: env.MONGO_HOST || 'localhost',
  MONGO_PORT: env.MONGO_PORT || '15498',
  MONGO_DB: env.MONGO_DB || 'webpack_project',
};
