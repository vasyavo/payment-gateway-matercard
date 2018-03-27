const CardModel = require('../../../../../collections/card');
const {
    masterCardSender,
    logger,
} = require('../../../../../utils');
const {
    merchantId,
} = require('../../../../../config');

const handler = async (req, res, next) => {
    const _id = req.params._id;
    const customer = req.body.customer;
    try {
        const card = await CardModel.findOne({
            _id,
            customer,
        });

        await masterCardSender.delete(`https://ap-gateway.mastercard.com/api/rest/version/46/merchant/${merchantId}/token/${card.masterCardId}`);
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    try {
        await CardModel.removeOne({
            _id,
            customer,
        });
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send('Card was successfully deleted');
};

module.exports = handler;
