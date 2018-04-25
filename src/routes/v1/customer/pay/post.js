const db = require('../../../../utils/connection').db;
const collectionName = require('../../../../constants/contentType').CARD;
const collection = db.collection(collectionName);
const {
    masterCardSender,
    logger,
} = require('../../../../utils');
const {
    merchantId,
} = require('../../../../config');
const ObjectID = require('bson-objectid');

const handler = async (req, res, next) => {
    const {
        cardId,
        customer,
        order,
    } = req.body;
    let card;
    let result;

    try {
        card = await collection.findOne({
            _id: cardId,
            customer,
        });

        if (!card) {
            throw new Error('Card not found');
        }
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    try {
        result = await masterCardSender.put({
            order,
            sourceOfFunds: {
                token: card.masterCardId,
            },
        }, `https://ap-gateway.mastercard.com/api/rest/version/46/merchant/${merchantId}/order/${ObjectID()}/transaction/${ObjectID()}`);

        console.log(result);
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send({
        status: 'Successfully payed',
        transactionId: result.id,
    });
};

module.exports = handler;
