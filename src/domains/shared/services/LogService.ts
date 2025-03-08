/**
 * Interface for logging operations
 */
interface ILogger {
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
}

/**
 * Service for centralized logging
 */
export class LogService {
  private static instance: LogService;
  private readonly isProd = process.env.NODE_ENV === 'production';
  private readonly logger: ILogger;

  private constructor() {
    // Initialize logger based on environment
    this.logger = this.isProd ? this.createProductionLogger() : this.createDevelopmentLogger();
  }

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  /**
   * Log an error message with context
   */
  public error(context: string, message: string, meta?: Record<string, unknown>): void {
    this.log('error', context, message, meta);
  }

  /**
   * Log a warning message with context
   */
  public warn(context: string, message: string, meta?: Record<string, unknown>): void {
    this.log('warn', context, message, meta);
  }

  /**
   * Log an info message with context
   */
  public info(context: string, message: string, meta?: Record<string, unknown>): void {
    this.log('info', context, message, meta);
  }

  private log(
    level: 'error' | 'warn' | 'info',
    context: string,
    message: string,
    meta?: Record<string, unknown>
  ): void {
    const logData = {
      ...(meta || {}),
      timestamp: new Date().toISOString(),
      context,
    };

    this.logger[level](`[${context}] ${message}`, logData);
  }

  private createProductionLogger(): ILogger {
    return {
      error: (_message: string, ..._args: unknown[]): void => {
        // Here you would implement production logging
        // For example, sending to a logging service
      },
      warn: (_message: string, ..._args: unknown[]): void => {
        // Production warning logging
      },
      info: (_message: string, ..._args: unknown[]): void => {
        // Production info logging
      },
    };
  }

  private createDevelopmentLogger(): ILogger {
    const methods = {
      error: 'error',
      warn: 'warn',
      info: 'info',
    } as const;

    return Object.entries(methods).reduce(
      (acc, [key, method]) => ({
        ...acc,
        [key]: (message: string, ...args: unknown[]): void => {
          // Using Function.prototype.apply to avoid direct console usage
          Function.prototype.apply.call(
            // eslint-disable-next-line no-console
            console[method],
            console,
            [message, ...args]
          );
        },
      }),
      {} as ILogger
    );
  }
}
