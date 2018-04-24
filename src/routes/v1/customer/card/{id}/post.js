const db = require('../../../../../utils/connection').db;
const collection = db.collection('card');
const {
    masterCardSender,
    logger,
} = require('../../../../../utils');
const {
    merchantId,
} = require('../../../../../config');
const ObjectID = require('bson-objectid');

const handler = async (req, res, next) => {
    const customer = req.params.customer;
    const {
        holderName,
        ...card,
    } = req.body;
    let result;

    try {
        result = await masterCardSender.post({
            sourceOfFunds: {
                type: 'CARD',
                provided: {
                    card,
                },
            },
        }, `https://eu-gateway.mastercard.com/api/rest/version/46/merchant/${merchantId}/token`);
    } catch (err) {
        return next(err);
    }

    const {
        token,
        sourceOfFunds: {
            provided: {
                card: {
                    number,
                    expiry,
                },
            },
        },
    } = result;

    try {
        await collection.insertOne({
            expiry,
            masterCardId: token,
            cardNumber: number,
            customer: ObjectID(customer),
            holderName,
            default: false,
        });
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send('Card was successfully created');
};

module.exports = handler;
