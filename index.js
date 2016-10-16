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
const pick = require('lodash.pick');
const last = require('lodash.last');
const url = require('url');

const DEFAULT_PROTOCOL = 'amqp';
const DEFAULT_PARAMETERS = ['frameMax', 'channelMax', 'heartbeat', 'locale'];

module.exports = {
  format
};

function query(uri, query) {
  query = pick(query, DEFAULT_PARAMETERS);
  if (Object.keys(query).length) {
    uri.query = Object.assign({}, uri.query, query);
  }
  return uri;
}

function protocol(uri) {
  var parts;
  if (!uri.startsWith(DEFAULT_PROTOCOL)) {
    parts = uri.split('://');
    uri = [DEFAULT_PROTOCOL, last(parts)].join('://');
  }
  return uri;
}

function auth(uri, auth) {
  if (!uri.auth && auth.username && auth.password) {
    uri.auth = [auth.username, auth.password].join(':');
  }
  return uri;
}

function port(uri, opts) {
  if (!uri.port && opts.port) {
    uri.port = opts.port;
  }
  return uri;
}

function vhost(uri, opts) {
  var vhost = opts.vhost || opts.path;
  if (!uri.pathname && vhost) {
    uri.pathname = vhost;
  }
  return uri;
}

function format(opts) {
  var uri = opts.hostname || opts.host || opts.url || opts.href || '';
  if (opts && uri) {
    uri = protocol(uri);
    uri = url.parse(uri);
    // Remove `host` created by `url.parse` if none was given
    uri.host = opts.host ? uri.host : null;
    port(uri, opts);
    auth(uri, opts);
    vhost(uri, opts);
    query(uri, opts);
    uri = uri.format();
  }
  return uri;
}
