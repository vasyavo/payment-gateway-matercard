const collectionPromise = require('../../../../../collections/card');
const ObjectID = require('bson-objectid');
const {
    errorGenerator,
} = require('../../../../../utils');

module.exports = async (req, res, next) => {
    const collection = await collectionPromise;
    const _id = ObjectID(req.params._id);

    try {
        const card = await collection.findOneAndUpdate({
            _id,
        }, {
            $set: {
                default: true,
            },
        }).then(data => data.value);

        if (!card) {
            throw errorGenerator('Card was not found');
        }

        await collection.updateMany({
            customer: card.customer,
            _id: {
                $ne: _id,
            },
        }, {
            $set: {
                default: false,
            },
        });

        // eslint-disable-next-line global-require
        res.status(200).send({ cardNumber: card.cardNumber });
    } catch (err) {
        return next(err);
    }
};
