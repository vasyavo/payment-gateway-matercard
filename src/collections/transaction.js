const collectionName = require('../constants/contentType').TRANSACTION;
const connection = require('../utils/connection');

module.exports = (async () => {
    const db = await connection;
    const collection = await db.createCollection(collectionName, {
        validator: {
            $or: [
                {
                    $and: [
                        {
                            masterCardId: {
                                $exists: true,
                                $type: 'string',
                            },
                        },
                    ],
                },
            ],
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
