import Redis from "ioredis";
import { redisConfig } from "./configuration";

const config = redisConfig();

export const redis = new Redis(`rediss://:${config.REDIS_PASSWORD}@${config.REDIS_ENDPOINT}:${config.REDIS_PORT}`);

process.on("SIGINT", () => {
  redis.quit();
});

process.on("SIGTERM", () => {
  redis.quit();
});
