const {
    masterCardSender,
} = require('../../../../utils');
const {
    merchantId,
} = require('../../../../config');
const ObjectID = require('bson-objectid');
const transactionCollectionPromise = require('../../../../collections/transaction');

const handler = async (req, res, next) => {
    const transactionCollection = await transactionCollectionPromise;
    const {
        transaction,
        orderId,
    } = req.body;
    let result;

    try {
        result = await transactionCollection.findOne({
            _id: ObjectID(orderId),
        });

        if (!result) {
            throw new Error('Transaction not found');
        }
    } catch (err) {
        return next(err);
    }

    try {
        await masterCardSender.put({
            apiOperation: 'REFUND',
            transaction,
        }, `https://eu-gateway.mastercard.com/api/rest/version/46/merchant/${merchantId}/order/${result.masterCardId}/transaction/${ObjectID()}`);
    } catch (err) {
        return next(err);
    }

    res.status(200).send({
        status: 'Successfully refunded',
    });
};

module.exports = handler;
