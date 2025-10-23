import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  VERBOSE = 'VERBOSE',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  trace?: string;
  metadata?: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements NestLoggerService {
  private context?: string;
  private logsDir: string;

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.writeLog(LogLevel.INFO, message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeLog(LogLevel.ERROR, message, context, trace);
  }

  warn(message: any, context?: string) {
    this.writeLog(LogLevel.WARN, message, context);
  }

  debug(message: any, context?: string) {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  verbose(message: any, context?: string) {
    this.writeLog(LogLevel.VERBOSE, message, context);
  }

  private writeLog(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: context || this.context,
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      trace,
    };

    // Console output with colors
    this.consoleLog(logEntry);

    // File output
    this.fileLog(logEntry);
  }

  private consoleLog(entry: LogEntry) {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m', // Yellow
      INFO: '\x1b[32m', // Green
      DEBUG: '\x1b[36m', // Cyan
      VERBOSE: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';

    const contextStr = entry.context ? `[${entry.context}] ` : '';
    const color = colors[entry.level];
    
    console.log(
      `${color}[${entry.timestamp}] [${entry.level}]${reset} ${contextStr}${entry.message}`,
    );

    if (entry.trace) {
      console.log(`${color}${entry.trace}${reset}`);
    }
  }

  private fileLog(entry: LogEntry) {
    try {
      const date = new Date().toISOString().split('T')[0];
      const logFileName = `${date}-${entry.level.toLowerCase()}.log`;
      const logFilePath = path.join(this.logsDir, logFileName);

      const logLine = `${JSON.stringify(entry)}\n`;

      fs.appendFileSync(logFilePath, logLine, 'utf8');

      // Also write to combined log
      const combinedLogPath = path.join(this.logsDir, `${date}-combined.log`);
      fs.appendFileSync(combinedLogPath, logLine, 'utf8');
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  // Clean old log files (optional - keep last 30 days)
  cleanOldLogs(daysToKeep: number = 30) {
    try {
      const files = fs.readdirSync(this.logsDir);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      files.forEach((file) => {
        const filePath = path.join(this.logsDir, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          fs.unlinkSync(filePath);
          this.log(`Deleted old log file: ${file}`, 'LogCleaner');
        }
      });
    } catch (error) {
      this.error('Failed to clean old logs', error.stack, 'LogCleaner');
    }
  }
}
