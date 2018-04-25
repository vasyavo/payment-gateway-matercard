const db = require('../../../../../utils/connection').db;
const collectionName = require('../../../../../constants/contentType').CARD;
const collection = db.collection(collectionName);
const ObjectID = require('bson-objectid');
const {
    masterCardSender,
    errorGenerator,
    logger,
} = require('../../../../../utils');
const {
    merchantId,
} = require('../../../../../config');

const handler = async (req, res, next) => {
    const _id = ObjectID(req.params._id);
    try {
        const card = await collection.findOne({
            _id,
        });
        if (!card) {
            throw errorGenerator('Card was not found');
        }

        await masterCardSender.delete(`https://eu-gateway.mastercard.com/api/rest/version/47/merchant/${merchantId}/token/${card.masterCardId}`);
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    try {
        await collection.removeOne({
            _id,
        });
    } catch (err) {
        logger.log(err);
        return next(err);
    }
    // eslint-disable-next-line global-require
    res.status(200).send(require('../../../../../../raml/v1/customer/card/{id}/_delete/responses/200/example.json'));
};

module.exports = handler;
