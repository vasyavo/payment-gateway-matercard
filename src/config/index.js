const nconf = require('nconf');
// path to file with credentials
const path = require('path');
const workingDirectory = path.join(__dirname, '../../');

const cluster = require('cluster');
// for example NODE_ENV is development

const env = process.env.NODE_ENV || 'development';
const envPath = path.join(__dirname, `.env${env ? `.${env}` : ''}`).normalize();

// loads environment variables from a .env file into process.env
require('dotenv').config({
    path: envPath,
});

const config = {
    env,
    workingDirectory,
    host: nconf.get('HOST') || 'localhost',
};
config.logLevel = nconf.get('LOG_LEVEL') || 'info';
config.isTest = env === 'test';

config.port = parseInt(process.env.PORT, 10) || 3000;
config.debug = process.env.DEBUG_DEV || false;

/* Database configurations */
config.mongodbUri = nconf.get('MONGODB_URI') || 'mongodb://localhost:27017/payment-gateway-mastercard';
/* Database configurations */

/* AWS S3 configurations begin */

config.webConcurrency = nconf.get('WEB_CONCURRENCY') || 1;
config.isMaster = cluster.isMaster;

config.merchantId = process.env.MERCHANT_ID;
config.apiPassword = process.env.API_PASSWORD;

config.raml = path.join(workingDirectory, 'raml/api.raml');
config.ramlDoc = path.join(workingDirectory, 'docs/api.html');

config.host = nconf.get('HOST');

module.exports = config;
