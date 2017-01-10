'use strict';
const expect = require('chai').expect;
const uri = require('..');

describe('amqp-uri', () => {
  it('should default to amqp:// as protocol', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com'
    });
    expect(result).to.match(/^amqp:\/\//);
  });

  it('should replace protocol if it is not amqp://', () => {
    let result = uri.format({
      hostname: 'ftp://test.amqphost.com'
    });
    expect(result).to.match(/^amqp:\/\//);
  });

  it('should allow SSL protocol amqps://', () => {
    let result = uri.format({
      hostname: 'amqps://test.amqphost.com'
    });
    expect(result).to.match(/^amqps:\/\//);
  });

  it('should throw TypeError if opts is undefined', () => {
    expect(uri.format.bind(uri, undefined)).to.throw(TypeError);
  });

  it('should return an empty string if hostname/url/host/href is missing', () => {
    let result = uri.format({});
    expect(result).to.eql('');
  });

  it('should allow adding a host', () => {
    let result = uri.format({
      host: 'test.amqphost.com:5432'
    });
    expect(result).to.have.string('test.amqphost.com:5432');
  });

  it('should allow adding a hostname', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com'
    });
    expect(result).to.have.string('test.amqphost.com');
  });

  it('should allow adding a full URL', () => {
    let result = uri.format({
      url: 'amqp://test.amqphost.com:80/myvhost'
    });
    expect(result).to.eql('amqp://test.amqphost.com:80/myvhost');
  });

  it('should allow adding a port', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com',
      port: 5432
    });
    expect(result).to.have.string('test.amqphost.com:5432');
  });

  it('should allow adding a port', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com',
      port: 5432
    });
    expect(result).to.have.string('test.amqphost.com:5432');
  });

  it('should allow adding username and password', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com',
      username: 'someuser',
      password: 'secret'
    });
    expect(result).to.have.string('someuser:secret@test.amqphost.com');
  });

  it('should allow adding vhost', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com',
      vhost: 'somevhost'
    });
    expect(result).to.have.string('test.amqphost.com/somevhost');
  });

  it('should ignore additional unknown options', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com',
      foo: 'bar',
      baz: 42
    });
    expect(result).to.eql('amqp://test.amqphost.com');
  });

  it('should allow adding AMQP options as query parameters', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com',
      frameMax: 1024,
      channelMax: 1000,
      heartbeat: 500,
      locale: 'en_US'
    });
    expect(result).to.have.string('?frameMax=1024&channelMax=1000&heartbeat=500&locale=en_US');
  });

  it('should allow building a full AMQP URI', () => {
    let result = uri.format({
      hostname: 'test.amqphost.com',
      port: 5672,
      vhost: 'vhost',
      username: 'guest',
      password: 'guest',
      frameMax: 1024,
      channelMax: 1000,
      heartbeat: 500,
      locale: 'en_US'
    });
    expect(result).to.eql('amqp://guest:guest@test.amqphost.com:5672/vhost?frameMax=1024&channelMax=1000&heartbeat=500&locale=en_US');
  });
});
