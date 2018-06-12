'use strict';
const uri = require('..');

describe('amqp-uri', () => {
  it('should default to amqp:// as protocol', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com'
    });
    expect(result).toMatch(/^amqp:\/\//);
  });

  it('should not replace protocol if it is not amqp://', () => {
    const result = uri.format({
      hostname: 'ftp://test.amqphost.com'
    });
    expect(result).toMatch(/^ftp:\/\//);
  });

  it('should allow SSL protocol amqps://', () => {
    const result = uri.format({
      hostname: 'amqps://test.amqphost.com'
    });
    expect(result).toMatch(/^amqps:\/\//);
  });

  it('should not throw Error if opts is undefined', () => {
    expect(() => uri.format(undefined)).not.toThrow(Error);
  });

  it('should return an empty string if hostname/url/host/href is missing', () => {
    const result = uri.format({});
    expect(result).toBe('');
  });

  it('should allow adding a host', () => {
    const result = uri.format({
      host: 'test.amqphost.com:5432'
    });
    expect(result).toEqual(expect.stringContaining('test.amqphost.com:5432'));
  });

  it('should allow adding a hostname', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com'
    });
    expect(result).toEqual(expect.stringContaining('test.amqphost.com'));
  });

  it('should allow adding a full URL', () => {
    const result = uri.format({
      url: 'amqp://test.amqphost.com:80/myvhost'
    });
    expect(result).toBe('amqp://test.amqphost.com:80/myvhost');
  });

  it('should allow adding a port', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com',
      port: 5432
    });
    expect(result).toEqual(expect.stringContaining('test.amqphost.com:5432'));
  });

  it('should not add a port if one is not specified', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com'
    });
    expect(result).toEqual(expect.stringContaining('test.amqphost.com'));
  });

  it('should allow adding username and password', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com',
      username: 'someuser',
      password: 'secret'
    });
    expect(result).toEqual(
      expect.stringContaining('someuser:secret@test.amqphost.com')
    );
  });

  it('should allow adding vhost', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com',
      vhost: 'somevhost'
    });
    expect(result).toEqual(
      expect.stringContaining('test.amqphost.com/somevhost')
    );
  });

  it('should ignore additional unknown options', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com',
      foo: 'bar',
      baz: 42
    });
    expect(result).toBe('amqp://test.amqphost.com');
  });

  it('should allow adding AMQP options as query parameters', () => {
    const result = uri.format({
      hostname: 'test.amqphost.com',
      frameMax: 1024,
      channelMax: 1000,
      heartbeat: 500,
      locale: 'en_US'
    });
    expect(result).toEqual(
      expect.stringContaining(
        '?frameMax=1024&channelMax=1000&heartbeat=500&locale=en_US'
      )
    );
  });

  it('should allow building a full AMQP URI', () => {
    const result = uri.format({
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
    expect(result).toBe(
      'amqp://guest:guest@test.amqphost.com:5672/vhost?frameMax=1024&channelMax=1000&heartbeat=500&locale=en_US'
    );
  });

  it('should create correct URI if hostname starts with "amqp"', () => {
    const result = uri.format({
      hostname: 'amqp.host.com',
      port: 5672,
      vhost: 'vhost',
      username: 'guest',
      password: 'guest'
    });
    expect(result).toBe('amqp://guest:guest@amqp.host.com:5672/vhost');
  });
});
