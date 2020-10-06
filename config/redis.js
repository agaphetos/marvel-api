function loadRedisConfig() {
  const { REDIS_HOST, REDIS_PORT, REDIS_ABSOLUTE_EXPIRY } = process.env;

  if (REDIS_HOST && REDIS_PORT) {
    const redis = {};

    redis.credentials = {
      host: REDIS_HOST,
      port: REDIS_PORT,
    }

    if (REDIS_ABSOLUTE_EXPIRY) {
      redis.absoluteExpiry = REDIS_ABSOLUTE_EXPIRY;
    }

    return redis;
  }

  return undefined;
}

module.exports = loadRedisConfig();