const request = require('request');
const {
    merchantId,
    apiPassword,
} = require('../config');
const errorGenerator = require('./errorGenerator');
const responseHandler = (resolve, reject) => (err, httpResponse, body) => {
    if (typeof body === 'string') {
        body = JSON.parse(body);
    }
    const {
        result,
    } = body;

    if (result === 'SUCCESS') {
        return resolve(body);
    } else if (result === 'FAILURE') {
        return reject(errorGenerator('The operation was declined or rejected by the gateway, acquirer or issuer'));
    } else if (result === 'PENDING') {
        return reject(errorGenerator('The operation is currently in progress or pending processing'));
    } else {
        return reject(errorGenerator('The result of the operation is unknown'));
    }
};

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
            }, responseHandler(resolve, reject));
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
            }, responseHandler(resolve, reject));
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
            }, responseHandler(resolve, reject));
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
            }, responseHandler(resolve, reject));
        });
    },
};
