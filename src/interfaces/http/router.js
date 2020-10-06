const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const methodOverride = require('method-override');

const createControllerRoutes = require('./utils/create-controller-routes');

const errorHandler = require('./middlewares/error-handler');
const routeMethodNotFound = require('./middlewares/route-method-not-found');

module.exports = ({
  config, containerMiddleware, loggerMiddleware,
}) => {
  const router = Router();
  router.use((containerMiddleware));

  /* istanbul ignore if */
  if (config.env !== 'test') {
    router.use(loggerMiddleware);
  }

  const apiRouter = Router();

  apiRouter
    .use(methodOverride('X-HTTP-Method-Override'))
    .use(cors())
    .use(bodyParser.json())
    .use(compression());

  const v1Router = Router();
  if (config.env !== 'production') {
    v1Router.use('/docs', require('./controllers/v1/DocsController'));
  }

  v1Router.use('/characters', createControllerRoutes('controllers/v1/CharactersController'));

  apiRouter.use('/v1', v1Router);

  router.use('/api', apiRouter);
  router.use(errorHandler); 
  router.use(routeMethodNotFound);

  return router;
};
