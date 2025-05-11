import { Redis } from "ioredis";

import { env } from "@/env";

export const redisClient = new Redis(env.REDIS_URL);

// Key prefixes for different Redis keys
export const REDIS_KEYS = {
    USER_STREAK: (userId: string) => `streak:${userId}`,
    HAS_STREAK_TODAY: (userId: string) => `streak:${userId}:today`,
};

export const redis = {
    get: async (key: string) => {
        const value = await redisClient.get(key);
        return value ? value : null;
    },
    set: async (key: string, value: string, ttl?: number) => {
        if (ttl) await redisClient.set(key, value, "EX", ttl);
        else await redisClient.set(key, value);
    },
    delete: async (key: string) => {
        await redisClient.del(key);
    },
};
