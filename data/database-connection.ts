import Redis from "ioredis";
import { redisConfig } from "./configuration";

// const config = redisConfig();

export const redis = new Redis(
  `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
);

process.on("SIGINT", () => {
  redis.quit();
});

process.on("SIGTERM", () => {
  redis.quit();
});
