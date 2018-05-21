const collectionPromise = require('../../../../../../collections/card');
const {
    errorGenerator,
} = require('../../../../../../utils');
const ObjectID = require('bson-objectid');

const handler = async (req, res, next) => {
    const collection = await collectionPromise;
    const _id = ObjectID(req.params.card);
    let card;

    try {
        card = await collection.findOne({
            _id,
        }, {
            default: 1,
            cardNumber: 1,
            holderName: 1,
            expiry: 1,
        }).toArray();

        if (!card) {
            return next(errorGenerator('Card was not found'));
        }
    } catch (err) {
        return next(err);
    }

    res.status(200).send(card);
};

module.exports = handler;
