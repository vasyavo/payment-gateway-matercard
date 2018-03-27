const request = require('request');
const {
    merchantId,
    apiPassword,
} = require('../config');
const auth = `Basic ${new Buffer(`merchant.${merchantId}:${apiPassword}`).toString('base64')}`;

module.exports = {
    post: (apiParams, url) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'post',
                json: true,
                body: apiParams,
                headers: {
                    'content-type': 'application/json',
                    Authorization: auth,
                },
                /*auth: {
                    user: `merchant.${merchantId}`,
                    pass: apiPassword,
                    sendImmediately: false,
                },*/
                url,
            }, (err, httpResponse, body) => {
                if (err) {
                    return reject(err);
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
                headers: {
                    Authorization: auth,
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    return reject(err);
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
                headers: {
                    Authorization: auth,
                },
            }, (err, httpResponse, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(body);
            });
        });
    },

    delete: (url) => {
        return new Promise((resolve, reject) => {
            request({
                method: 'delete',
                headers: {
                    Authorization: auth,
                },
                url,
            }, (err, httpResponse, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(body);
            });
        });
    },
}
