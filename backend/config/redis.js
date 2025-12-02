import Redis from 'ioredis';

/**
 * Create and configure Redis client
 * Supports both local (development) and cloud (production) Redis
 * @returns {Redis} Configured Redis client
 */
export function createRedisClient() {
  // Debug: Check what environment variables are available
  console.log('🔍 Environment:', process.env. NODE_ENV);
  console. log('🔍 REDIS_URL:', process.env.REDIS_URL ?  'SET ✅' : 'NOT SET ❌');
  
  const redisUrl = process. env. REDIS_URL;
  let redis;

  // Production: Use REDIS_URL (cloud Redis)
  if (redisUrl) {
    console. log('🔗 Connecting to cloud Redis...');
    console.log('🔗 URL prefix:', redisUrl.substring(0, 15) + '...');
    
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      // Enable TLS for secure connections (rediss://)
      tls: redisUrl.startsWith('rediss://') ? {
        rejectUnauthorized: false
      } : undefined,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  } 
  // Development: Use local Redis
  else {
    console.log('🔗 Connecting to local Redis...');
    
    // Fail fast in production if REDIS_URL is missing
    if (process.env.NODE_ENV === 'production') {
      console.error('');
      console.error('❌ FATAL ERROR: REDIS_URL not set in production!');
      console.error('');
      console.error('📋 To fix this:');
      console.error('  1. Go to Railway dashboard');
      console.error('  2. Add Redis database (+ New → Database → Redis)');
      console.error('  3. Add REDIS_URL to backend Variables tab');
      console.error('  4. Reference: ${{Redis.REDIS_URL}}');
      console.error('');
      process.exit(1);
    }
    
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env. REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process. env.REDIS_DB) || 0,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }

  // Event handlers
  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('ready', () => {
    console. log('✅ Redis ready to accept commands');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err. message);
    
    // Additional help for common errors
    if (err.code === 'ECONNREFUSED') {
      console.error('💡 Tip: Make sure Redis is running');
      if (process.env.NODE_ENV === 'production') {
        console. error('💡 In production: Check if REDIS_URL is set correctly');
      } else {
        console.error('💡 In development: Run "sudo service redis-server start" in Ubuntu/WSL');
      }
    }
  });

  redis.on('close', () => {
    console.log('🔴 Redis connection closed');
  });

  redis.on('reconnecting', () => {
    console.log('🔄 Redis reconnecting...');
  });

  return redis;
}

/**
 * Check Redis health
 * @param {Redis} redis - Redis client
 * @returns {Promise<boolean>}
 */
export async function checkRedisHealth(redis) {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error. message);
    return false;
  }
}

export default createRedisClient;