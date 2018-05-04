const ClientConnection = require('../collections/client');
const logger = require('../utils/logger');
const generateError = require('../utils/errorGenerator');

async function auth(req, res, next) {
    const ClientCollection = await ClientConnection;

    const clientId = req.get('CLIENT-ID');
    const clientSecret = req.get('CLIENT-SECRET');

    try {
        const credentials = {
            clientId,
            clientSecret,
        };

        const client = await ClientCollection.findOne(credentials);

        if (!client) {
            logger.error('Try to access using application credentials:', credentials);

            return next(generateError('You can\'t sign in through your application'));
        }

        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = auth;
