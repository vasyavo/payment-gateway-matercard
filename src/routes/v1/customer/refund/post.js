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
        transaction,
        orderId,
    } = req.body;
    let result;

    try {
        result = await masterCardSender.put({
            apiOperation: 'REFUND',
            transaction,
        }, `https://eu-gateway.mastercard.com/api/rest/version/46/merchant/${merchantId}/order/${orderId}/transaction/${ObjectID()}`);

        console.log(result);
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send({
        status: 'Successfully refunded',
        orderId: result.order.id,
    });
};

module.exports = handler;
