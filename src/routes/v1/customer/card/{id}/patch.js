const db = require('../../../../../utils/connection').db;
const collectionName = require('../../../../../constants/contentType').CARD;
const collection = db.collection(collectionName);
const ObjectID = require('bson-objectid');
const {
    errorGenerator,
    logger,
} = require('../../../../../utils');

module.exports = async (req, res, next) => {
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
    } catch (err) {
        logger.log(err);
        return next(err);
    }
    // eslint-disable-next-line global-require
    res.status(200).send(require('../../../../../../raml/v1/customer/card/{id}/_patch/responses/200/example.json'));
};
