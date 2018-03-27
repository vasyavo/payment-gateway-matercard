const logger = require('./logger');

module.exports = (message = 'Bad Request', status = 400) => {
    const error = new Error(message);
    error.status = status;

    logger.log(message);
    return error;
};
