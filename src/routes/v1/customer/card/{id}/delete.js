const collectionPromise = require('../../../../../collections/card');
const ObjectID = require('bson-objectid');
const {
    masterCardSender,
    errorGenerator,
} = require('../../../../../utils');
const {
    merchantId,
} = require('../../../../../config');

const handler = async (req, res, next) => {
    const collection = await collectionPromise;
    const _id = ObjectID(req.params._id);
    let card;
    try {
        card = await collection.findOne({
            _id,
        });
        if (!card) {
            throw errorGenerator('Card was not found');
        }

        await masterCardSender.delete(`https://eu-gateway.mastercard.com/api/rest/version/47/merchant/${merchantId}/token/${card.masterCardId}`);
    } catch (err) {
        return next(err);
    }

    try {
        await collection.removeOne({
            _id,
        });
    } catch (err) {
        return next(err);
    }
    // eslint-disable-next-line global-require
    res.status(200).send({ cardNumber: card.cardNumber });
};

module.exports = handler;
