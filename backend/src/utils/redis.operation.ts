import { logError } from "../config/logger.js";
import { redis } from "../config/redis.config.js";

export const redisOperation = {

    // Getting data from Redis
    async get(key: string) {
        try {
            return await redis.get(key);
        } catch (error) {
            logError("Unable to get data from Redis", error);
            return null;
        }
    },

    // set data into Redis
    async setEx(key: string, ttl: number, value: string) {
        try {
            await redis.setEx(key, ttl, value);
        } catch (err) {
            logError("Failed to save data into redis", err);
        }
    },

    // delete from Redis
    async del(pattern: string) {
        try {
            for await (const keys of redis.scanIterator({
                MATCH: pattern,
                COUNT: 100,
            })) {
                if (keys.length > 0) {
                    await redis.del(keys);
                }
            }

            return true;
        } catch (error) {
            logError("Failed to delete data from redis", error);
            return false;
        }
    },

    // get ttl
    async ttl(key: string) {
        try {
            return await redis.ttl(key);
        } catch (error) {
            logError("Redis TTL failed", error);
            return -1;
        }
    }
}