import Joi, { isSchema } from "joi";

export interface RedisConfiguration {
  REDIS_ENDPOINT: string;
  REDIS_PASSWORD: string;
  REDIS_PORT: number;
}

const envSchema = Joi.object<RedisConfiguration>({
  REDIS_ENDPOINT: Joi.string().default("localhost"),
  REDIS_PASSWORD: Joi.string().default(""),
  REDIS_PORT: Joi.number().default(6379),
});

export const redisConfig = (): RedisConfiguration => {
  const result = envSchema.validate(process.env);
  if (!result.error) return result.value;
  else throw result.error;
};
