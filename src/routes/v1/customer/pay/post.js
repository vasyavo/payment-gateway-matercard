const collectionPromise = require('../../../../collections/card');
const transactionCollectionPromise = require('../../../../collections/transaction');
const {
    masterCardSender,
} = require('../../../../utils');
const {
    merchantId,
} = require('../../../../config');
const ObjectID = require('bson-objectid');

const handler = async (req, res, next) => {
    const collection = await collectionPromise;
    const transactionCollection = await transactionCollectionPromise;
    const {
        cardId,
        order,
    } = req.body;
    let card;
    let result;
    let transactionResult;

    try {
        card = await collection.findOne({
            _id: ObjectID(cardId),
        });

        if (!card) {
            throw new Error('Card not found');
        }
    } catch (err) {
        return next(err);
    }


    order.amount = `${order.amount}`;

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
    } catch (err) {
        return next(err);
    }

    try {
        transactionResult = await transactionCollection.insertOne({
            masterCardId: result.order.id,
        });
    } catch (err) {
        return next(err);
    }

    res.status(200).send({
        status: 'Successfully payed',
        orderId: transactionResult.insertedId,
    });
};

module.exports = handler;
