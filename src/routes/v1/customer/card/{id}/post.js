const CardCollection = require('../../../../../collections/card');
const {
    masterCardSender,
    logger,
} = require('../../../../../utils');
const {
    merchantId,
} = require('../../../../../config');

const handler = async (req, res, next) => {
    const customer = req.params._id;
    const card = req.body;
    let result;

    try {
        result = await masterCardSender.post({
            sourceOfFunds: {
                type: 'CARD',
                provided: {
                    card,
                },
            },
        }, `https://ap-gateway.mastercard.com/api/rest/version/46/merchant/${merchantId}/token`);

        console.log(result);
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    const {
        token,
        sourceOfFunds: {
            provided: {
                card: {
                    number,
                },
            },
        },
    } = result;

    try {
        await CardCollection.insertOne({
            masterCardId: token,
            cardNumber: number,
            customer,
            default: false,
        });
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send('Card was successfully created');
};

module.exports = handler;
