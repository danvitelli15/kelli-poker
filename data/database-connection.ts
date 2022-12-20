import Redis from "ioredis";
import { redisConfig } from "./configuration";

// const config = redisConfig();

export const redis = new Redis({
  connectTimeout: 10000,
  host: process.env.REDIS_ENDPOINT,
  port: parseInt(process.env.REDIS_PORT),
});

process.on("SIGINT", () => {
  redis.quit();
});

process.on("SIGTERM", () => {
  redis.quit();
});
