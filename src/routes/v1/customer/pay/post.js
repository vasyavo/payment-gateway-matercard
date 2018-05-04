const collectionPromise = require('../../../../collections/card');
const {
    masterCardSender,
    logger,
} = require('../../../../utils');
const {
    merchantId,
} = require('../../../../config');
const ObjectID = require('bson-objectid');

const handler = async (req, res, next) => {
    const collection = await collectionPromise;
    const {
        cardId,
        order,
    } = req.body;
    let card;
    let result;

    try {
        card = await collection.findOne({
            _id: ObjectID(cardId),
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
            apiOperation: 'PAY',
            order,
            risk: {
                bypassMerchantRiskRules: 'ALL',
            },
            sourceOfFunds: {
                token: card.masterCardId,
            },
        }, `https://eu-gateway.mastercard.com/api/rest/version/47/merchant/${merchantId}/order/${ObjectID()}/transaction/${ObjectID()}`);

        console.log(result);
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send({
        status: 'Successfully payed',
        orderId: result.order.id,
    });
};

module.exports = handler;
