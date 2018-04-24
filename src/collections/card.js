const collectionName = require('../constants/contentType').CARD;
const db = require('../utils/connection').db;

module.exports = (async () => {
    const collection = await db.createCollection(collectionName, {
        validator: {
            $and: [{
                masterCardId: {
                    $exists: true,
                },
            }, {
                masterCardId: {
                    $type: 'string',
                },
            }, {
                default: {
                    $type: 'bool',
                },
            }, {
                cardNumber: {
                    $exists: true,
                },
            }, {
                cardNumber: {
                    $type: 'string',
                },
            }, {
                customer: {
                    $exists: true,
                },
            }, {
                holderName: {
                    $type: 'string',
                },
            }, {
                holderName: {
                    $exists: true,
                },
            }, {
                expiry: {
                    $type: 'string',
                },
            }, {
                expiry: {
                    $exists: true,
                },
            }, {
                customer: {
                    $type: 'objectId',
                } }],
        },
        validationLevel: 'strict',
        validationAction: 'error',
    });

    await collection.createIndex({
        masterCardId: 1,
    }, {
        unique: true,
    });

    return collection;
})();
