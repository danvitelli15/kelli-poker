import pino from "pino";

const transport =
  process.env.PRETTY_LOGS === "true"
    ? { transport: { options: { colorize: true, messageFormat: "{service} | {msg}" }, target: "pino-pretty" } }
    : {};

export const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  ...transport,
});

export const loggerFactory = (service: string) => baseLogger.child({ service });
