type LOG_LEVEL_OFF = 0;
type LOG_LEVEL_DEBUG = 1;
type LOG_LEVEL_INFO = 2;
type LOG_LEVEL_WARN = 4;
type LOG_LEVEL_ERROR = 8;

type LogLevel =
  | LOG_LEVEL_OFF
  | LOG_LEVEL_DEBUG
  | LOG_LEVEL_INFO
  | LOG_LEVEL_WARN
  | LOG_LEVEL_ERROR;

const LOG_LEVEL_OFF: LogLevel = 0;
const LOG_LEVEL_DEBUG: LogLevel = 1;
const LOG_LEVEL_INFO: LogLevel = 2;
const LOG_LEVEL_WARN: LogLevel = 4;
const LOG_LEVEL_ERROR: LogLevel = 8;

const LOG_LEVEL: LogLevel = 0;

// Log formatting
const LOG_FORMATS = new Map([
  [LOG_LEVEL_OFF, "font-weight: bold;"],
  [LOG_LEVEL_DEBUG, "color: #101010; background-color: #f3f3f3;"],
  [LOG_LEVEL_INFO, "color: ##1f1f1f; background-color: lightblue; "],
  [LOG_LEVEL_WARN, "color: #7d8006; background-color: #f1f3a1;"],
  [LOG_LEVEL_ERROR, "color: #fbefef; background-color: #9c0a0a;"],
]);

// Log level prefix
const LOG_PREFIX = new Map([
  [LOG_LEVEL_OFF, "OFF"],
  [LOG_LEVEL_DEBUG, "DEBUG"],
  [LOG_LEVEL_INFO, "INFO"],
  [LOG_LEVEL_WARN, "WARNING"],
  [LOG_LEVEL_ERROR, "ERROR"],
]);

const LOG_FUNCTIONS = new Map([
  [LOG_LEVEL_OFF, () => {}],
  [LOG_LEVEL_DEBUG, console.log],
  [LOG_LEVEL_INFO, console.info],
  [LOG_LEVEL_WARN, console.warn],
  [LOG_LEVEL_ERROR, console.error],
]);

/**
 * Displays the color-coded log message into the console log
 * @param module Name of the originating module
 * @param logLevel Log level for this message
 * @param data Data to display, split into a [title, ...rest]
 */
const log = (logLevel: LogLevel, message: string, data?: any) => {
  if (filter(logLevel)) return;

  const coloredTitle = `%c[${LOG_PREFIX.get(
    logLevel
  )}] vtta-extension: %c${message}`;
  const logFunction = LOG_FUNCTIONS.get(logLevel);
  const logFormat = LOG_FORMATS.get(logLevel);
  if (data) {
    logFunction(coloredTitle, logFormat + ";font-weight:bold", logFormat);
    logFunction(data);
  } else {
    logFunction(coloredTitle, logFormat + ";font-weight:bold", logFormat);
  }
};

/**
 * Filters all log messages that are below the configured module threshold
 * @param module Name of the originating module
 * @param logLevel Log level for this message
 */
const filter = (logLevel: LogLevel) => {
  return logLevel < LOG_LEVEL;
};

/**
 * Construct the global object
 */
const logger = {
  debug: (message: string, data?: any) => log(LOG_LEVEL_DEBUG, message, data),
  info: (message: string, data?: any) => log(LOG_LEVEL_INFO, message, data),
  warn: (message: string, data?: any) => log(LOG_LEVEL_WARN, message, data),
  error: (message: string, data?: any) => log(LOG_LEVEL_ERROR, message, data),
};

/**
 * Assign the global object or expand it at least
 */
export default logger;
