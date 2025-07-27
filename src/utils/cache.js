const cache = {};
const CACHE_EXPIRATION = 3600 * 1000; // 1 hour

const isCacheValid = (key) => {
  const currentTime = Date.now();
  return cache[key] && currentTime - cache[key].timestamp < CACHE_EXPIRATION;
};

const getCache = (key) => cache[key]?.data;

const setCache = (key, data) => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};

const clearCache = (key) => {
  delete cache[key];
};

const clearCacheByKey = (key) => {
  if (cache[key]) {
    delete cache[key];
  }
};

// ✅ Auto clear expired cache
const autoClearExpiredCache = () => {
  const currentTime = Date.now();

  for (const key in cache) {
    if (currentTime - cache[key].timestamp >= CACHE_EXPIRATION) {
      delete cache[key];
      console.log(`⏰ Cache for "${key}" cleared automatically`);
    }
  }
};

// Run this cleanup every 60 seconds
setInterval(autoClearExpiredCache, 60 * 1000);

export { isCacheValid, getCache, setCache, clearCache, clearCacheByKey };
