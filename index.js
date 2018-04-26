'use strict';
/**
 * Parses an object such as:
 *
 * {
 *   hostname: 'dev.rabbitmq.com',
 *   port: 5672,
 *   vhost: 'seneca',
 *   username: 'guest',
 *   password: 'guest',
 *   frameMax: 1024
 * }
 *
 * and builds an AMQP URI like:
 *
 * `amqp://guest:guest@dev.rabbitmq.com:5672/seneca?frameMax=1024`
 *
 * @module amqpuri
 */
module.exports = require('./lib/amqp-uri');
