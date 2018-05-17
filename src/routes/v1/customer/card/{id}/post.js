const collectionPromise = require('../../../../../collections/card');
const {
    masterCardSender,
} = require('../../../../../utils');
const {
    merchantId,
} = require('../../../../../config');
const ObjectID = require('bson-objectid');

const handler = async (req, res, next) => {
    const collection = await collectionPromise;
    const customer = ObjectID(req.params.customer);
    const {
        holderName,
        ...card
    } = req.body;
    let result;
    let response;

    try {
        result = await masterCardSender.post({
            sourceOfFunds: {
                type: 'CARD',
                provided: {
                    card,
                },
            },
        }, `https://eu-gateway.mastercard.com/api/rest/version/47/merchant/${merchantId}/token`);
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
    let cardResult;

    try {
        cardResult = await collection.insertOne({
            expiry,
            masterCardId: token,
            cardNumber: number,
            customer,
            holderName,
            default: false,
        });
    } catch (err) {
        return next(err);
    }

    try {
        response = await collection.findOne({
            _id: cardResult.insertedId,
        }, {
            default: 1,
            cardNumber: 1,
            holderName: 1,
            expiry: 1,
        });
    } catch (err) {
        return next(err);
    }
    res.status(201).send(response);
};

module.exports = handler;
