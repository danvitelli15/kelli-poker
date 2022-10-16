import pino from "pino";

export const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: { options: { colorize: true, messageFormat: "{service} | {msg}" }, target: "pino-pretty" },
});

export const loggerFactory = (service: string) => baseLogger.child({ service });
