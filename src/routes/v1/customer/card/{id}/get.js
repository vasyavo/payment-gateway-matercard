const collectionPromise = require('../../../../../collections/card');
const ObjectID = require('bson-objectid');

const {
    logger,
} = require('../../../../../utils');

const handler = async (req, res, next) => {
    const collection = await collectionPromise;
    const customer = ObjectID(req.params.customer);
    let cards;

    try {
        cards = await collection.find({
            customer,
        }, {
            default: 1,
            cardNumber: 1,
            holderName: 1,
            expiry: 1,
        }).toArray();
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send({ items: cards });
};

module.exports = handler;
