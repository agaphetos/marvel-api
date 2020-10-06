const redis = require('redis');

class RedisCaching {
  constructor({
    config,
    logger,
  }) {
    this.logger = logger;
    this.redisClient = redis.createClient(config.redis.credentials);
    this.redisClient.on('error', (error) => {
      this.logger.error(error);
    })
    this.absoluteExpiry = config.redis.absoluteExpiry || 86400;
  }

  async insertWithAbsoluteExpiry(key, value, expiryInSeconds) {
    return new Promise((resolve, reject) => {
      this.redisClient.setex(key, expiryInSeconds || this.absoluteExpiry, value, (err, reply) => {
        if (err) {
          return reject(err);
        }

        resolve(reply);
      });
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        
        if (reply) {
          return resolve(reply.toString());
        }

        return resolve(null);
      });
    });
  }

  async insert(key, value) {
    return new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (err, reply) => {
        if (err) {
          return reject(err);
        }

        resolve(reply);
      });
    });
  }
}

module.exports = RedisCaching;