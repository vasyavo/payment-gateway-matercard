const CardCollection = require('../../../../../collections/card');
const {
    logger,
} = require('../../../../../utils');

const handler = async (req, res, next) => {
    const customer = req.params.customer;
    let cards;

    try {
        cards = await CardCollection.find({
            customer,
        });
    } catch (err) {
        logger.log(err);
        return next(err);
    }

    res.status(200).send({ items: cards });
};

module.exports = handler;
