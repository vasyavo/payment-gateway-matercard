const request = require('request');
const {
    merchantId,
    apiPassword,
} = require('../config');
const errorGenerator = require('./errorGenerator');

module.exports = {
    post: (apiParams, url) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'post',
                json: true,
                body: apiParams,
                auth: {
                    user: `merchant.${merchantId}`,
                    pass: apiPassword,
                    sendImmediately: false,
                },
                url,
            }, (err, httpResponse, body) => {
                const {
                    result,
                } = body;

                if (result === 'ERROR') {
                    return reject(errorGenerator(body.error.explanation));
                }

                resolve(body);
            });
        });
    },
    put: (apiParams, url) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'put',
                json: apiParams,
                url,
                auth: {
                    user: `merchant.${merchantId}`,
                    pass: apiPassword,
                    sendImmediately: false,
                },
            }, (err, httpResponse, body) => {
                const {
                    result,
                } = body;

                if (result === 'ERROR') {
                    return reject(errorGenerator(body.error.explanation));
                }

                resolve(body);
            });
        });
    },
    get: (url) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'get',
                url,
                auth: {
                    user: `merchant.${merchantId}`,
                    pass: apiPassword,
                    sendImmediately: false,
                },
            }, (err, httpResponse, body) => {
                const {
                    result,
                } = body;

                if (result === 'ERROR') {
                    return reject(errorGenerator(body.error.explanation));
                }

                resolve(body);
            });
        });
    },

    delete: (url) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'delete',
                auth: {
                    user: `merchant.${merchantId}`,
                    pass: apiPassword,
                    sendImmediately: false,
                },
                url,
            }, (err, httpResponse, body) => {
                const {
                    result,
                } = body;

                if (result === 'ERROR') {
                    return reject(errorGenerator(body.error.explanation));
                }

                resolve(body);
            });
        });
    },
};
