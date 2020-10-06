/* eslint-disable import/no-unresolved */
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

function loadLoggingConfig() {
  if (fs.existsSync(path.join(__dirname, './logging.js'))) {
    return require('./logging')[ENV];
  }

  return undefined;
}

function loadMarvelConfig() {
  if (fs.existsSync(path.join(__dirname, './marvel.js'))) {
    return require('./marvel');
  }

  return undefined;
}

function loadRedisConfig() {
  if (fs.existsSync(path.join(__dirname, './redis.js'))) {
    return require('./redis');
  }

  return undefined;
}

module.exports = {
  logging: loadLoggingConfig(),
  env: ENV,
  web: {
    port: process.env.PORT || 8080,
  },
  redis: loadRedisConfig(),
  marvel: loadMarvelConfig(),
};
