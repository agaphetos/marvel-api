const {
  createContainer,
  Lifetime,
  asClass,
  asValue,
  asFunction,
} = require('awilix');
const { scopePerRequest } = require('awilix-express');

const config = require('../config');

const Server = require('./interfaces/http/Server');
const router = require('./interfaces/http/router');
const loggerMiddleware = require('./interfaces/http/middlewares/logger-middleware');

const helpers = require('./infra/helpers');
const utils = require('./infra/utils');

const logger = require('./infra/logging/logger');

const MarvelService = require('./infra/services/MarvelService');
const RedisCaching = require('./infra/caching/RedisCaching');

const container = createContainer();

/**
 * Application Layer
 */

container.loadModules(['src/app/**/*.js'], {
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    formatName: (name) => name.charAt(0).toUpperCase() + name.slice(1),
  },
}); // Operations

/**
 * Infra Layer
 */

container.register({
  MarvelService: asClass(MarvelService).singleton(),
  RedisCaching: asClass(RedisCaching).singleton(),
});

/**
 * Interface Layer
 */

// Middlewares
container.register({
  loggerMiddleware: asFunction(loggerMiddleware).singleton(),
  containerMiddleware: asValue(scopePerRequest(container)),
});

// Utils, Helpers
container.register({
  utils: asValue(utils),
  helpers: asValue(helpers),
});

/**
 * System
 */
container.register({
  server: asClass(Server).singleton(),
  router: asFunction(router).singleton(),
  logger: asFunction(logger).singleton(),
  config: asValue(config),
});


module.exports = container;
