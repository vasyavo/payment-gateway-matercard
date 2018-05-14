const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const addRequestId = require('express-request-id')();
const config = require('./config');
const logger = require('./utils/logger');
const authMiddleware = require('./utils/authMiddleware');

const {
    middleware,
    mockService,
} = require('./utils/osprey');

process.on('unhandledRejection', (reason, p) => {
    logger.error(p, reason);
});

process.on('uncaughtException', (error) => {
    logger.error(error);
});

const app = express();

(async () => {
    app.use(addRequestId);
    app.use(compress());
    app.disable('x-powered-by');
    app.use(bodyParser.json({
        extended: true,
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.get('/v1/api', require('./utils/sendRamlDoc'));

    app.use(middleware);
    app.use('/v1/customer/', authMiddleware, require('./routes/v1/customer/'));

    app.use(mockService);

    app.use(require('./utils/notFound'));
    app.use(require('./utils/errorHandler'));


    app.listen(config.port, () => {
        logger.info(`Server started at port ${config.port} in ${config.env} environment: ${JSON.stringify(config)}`);
    });
})();

module.exports = app;
