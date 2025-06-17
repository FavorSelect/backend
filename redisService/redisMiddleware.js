const redis = require('../../redisCaching/redisConfig');
const cache = (ttl = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));  // Return cached data
      }

      const originalJson = res.json.bind(res);
      res.json = async (data) => {
        await redis.set(key, JSON.stringify(data), { ex: ttl });
        originalJson(data);
      };

      next();
    } catch (err) {
      console.error('Redis error:', err);
      next();
    }
  };
};

module.exports = cache;
