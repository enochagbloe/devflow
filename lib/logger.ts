//import pino
import pino from "pino";

// check if the runtime is edge to avoid issues
const isEdge = process.env.NEXT_RUNTIME === "edge";
const isProduction = process.env.NODE_ENV === "production";

// implement the logger
const logger = pino({
  // We need a level to be able to see the logs
  level: process.env.LOG_LEVEL || "info",
  // how do you want to transport the error
  transport:
    !isEdge && !isProduction
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,

  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  // define your timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});
export default logger;