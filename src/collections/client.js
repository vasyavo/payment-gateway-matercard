const collectionName = require('../constants/contentType').CLIENTS;
const connection = require('../utils/connection');

module.exports = (async () => {
    const db = await connection;
    const collection = await db.createCollection(collectionName, {
        validator: {
            $or: [
                {
                    $and: [
                        {
                            clientId: {
                                $exists: true,
                                $type: 'string',
                            },
                        },
                        {
                            clientSecret: {
                                $exists: true,
                                $type: 'string',
                            },
                        },
                        {
                            name: {
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
        clientId: 1,
        clientSecret: 1,
        name: 1,
    }, {
        unique: true,
    });

    return collection;
})();
