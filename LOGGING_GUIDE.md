# Logging System Documentation

## Overview

This NestJS application includes a comprehensive logging system that tracks all API requests, responses, errors, and application events. The logging system provides both console output and file-based logging with automatic log rotation.

## Features

✅ **Full HTTP Request/Response Logging** - Every API call is logged with details  
✅ **Colored Console Output** - Different log levels have different colors for easy reading  
✅ **File-Based Logging** - Logs are saved to files organized by date and level  
✅ **Sensitive Data Redaction** - Passwords, tokens, and sensitive headers are automatically hidden  
✅ **Exception Tracking** - All errors and exceptions are logged with stack traces  
✅ **Service-Level Logging** - Custom logs from services (AuthService, EmployeeService)  
✅ **Automatic Log Cleanup** - Old logs are automatically removed after 30 days  

## Log Levels

The system supports the following log levels (in order of severity):

1. **ERROR** (Red) - Critical errors and exceptions
2. **WARN** (Yellow) - Warning messages
3. **INFO** (Green) - General information messages
4. **DEBUG** (Cyan) - Debug information
5. **VERBOSE** (Magenta) - Detailed verbose output

## Log File Structure

Logs are stored in the `logs/` directory in the root of your project:

```
logs/
├── 2025-10-23-error.log       # Only ERROR level logs
├── 2025-10-23-warn.log        # Only WARN level logs
├── 2025-10-23-info.log        # Only INFO level logs
├── 2025-10-23-debug.log       # Only DEBUG level logs
├── 2025-10-23-verbose.log     # Only VERBOSE level logs
└── 2025-10-23-combined.log    # All logs combined
```

Each log file contains JSON-formatted entries for easy parsing and analysis.

## Log Entry Format

Each log entry is a JSON object with the following structure:

```json
{
  "timestamp": "2025-10-23T10:30:45.123Z",
  "level": "INFO",
  "context": "HTTP",
  "message": "Request details...",
  "trace": "Stack trace (for errors only)",
  "metadata": "Additional data (optional)"
}
```

## HTTP Request Logging

Every incoming HTTP request is logged with the following information:

```json
{
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/login",
  "ip": "127.0.0.1",
  "userAgent": "PostmanRuntime/7.26.8",
  "body": {
    "email": "user@example.com",
    "password": "***REDACTED***"
  },
  "headers": {
    "content-type": "application/json",
    "authorization": "***REDACTED***"
  },
  "timestamp": "2025-10-23T10:30:45.123Z"
}
```

## HTTP Response Logging

Every outgoing HTTP response is logged with:

```json
{
  "type": "RESPONSE",
  "method": "POST",
  "url": "/auth/login",
  "statusCode": 200,
  "responseTime": "245ms",
  "response": {
    "accessToken": "***REDACTED***",
    "refreshToken": "***REDACTED***",
    "employee": { "id": 1, "email": "user@example.com" }
  },
  "timestamp": "2025-10-23T10:30:45.368Z"
}
```

## Error Logging

All errors and exceptions are automatically caught and logged:

```json
{
  "type": "ERROR",
  "method": "POST",
  "url": "/auth/login",
  "statusCode": 401,
  "responseTime": "123ms",
  "error": {
    "message": "Invalid credentials",
    "stack": "Error stack trace...",
    "name": "UnauthorizedException"
  },
  "timestamp": "2025-10-23T10:30:45.246Z"
}
```

## Service-Level Logging

Services automatically log important events:

### AuthService Logs:
- ✅ Employee validation attempts
- ✅ Login success/failure
- ✅ Token refresh requests
- ✅ Logout events
- ⚠️ Inactive account access attempts
- ⚠️ Invalid credentials
- ⚠️ Token mismatches

### EmployeeService Logs:
- ✅ Employee creation
- ✅ Employee queries
- ⚠️ Duplicate employee ID/email
- ❌ Database errors

## Sensitive Data Redaction

The following fields are automatically redacted in logs to protect sensitive information:

**Request/Response Body:**
- `password`
- `refreshToken`
- `accessToken`
- `token`

**Headers:**
- `authorization`
- `cookie`
- `x-api-key`
- `x-auth-token`

These fields will show as `***REDACTED***` in the logs.

## Using the Logger in Your Code

### Inject the Logger

```typescript
import { CustomLoggerService } from '../common';

@Injectable()
export class YourService {
  constructor(
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('YourService');
  }

  async yourMethod() {
    this.logger.log('This is an info message');
    this.logger.warn('This is a warning');
    this.logger.error('This is an error', stackTrace);
    this.logger.debug('This is debug info');
    this.logger.verbose('This is verbose output');
  }
}
```

### Log Examples

```typescript
// Simple log
this.logger.log('User logged in successfully');

// Log with data
this.logger.log(`Creating employee with ID: ${empId}`);

// Warning
this.logger.warn(`Duplicate email detected: ${email}`);

// Error with stack trace
try {
  // ... code
} catch (error) {
  this.logger.error(
    `Failed to process: ${error.message}`,
    error.stack
  );
}

// Debug information
this.logger.debug(`Query parameters: ${JSON.stringify(params)}`);
```

## Viewing Logs

### Console Logs

All logs are displayed in the console with color coding when you run the application:

```bash
pnpm run start:dev
```

### File Logs

Log files are located in the `logs/` directory:

```bash
# View today's combined logs
cat logs/2025-10-23-combined.log

# View only errors
cat logs/2025-10-23-error.log

# Follow logs in real-time (Linux/Mac)
tail -f logs/2025-10-23-combined.log

# Search for specific entries
grep "EmployeeService" logs/2025-10-23-combined.log
```

### Analyzing Logs

Since logs are in JSON format, you can use tools like `jq` for advanced filtering:

```bash
# Extract all ERROR logs
cat logs/2025-10-23-combined.log | grep ERROR | jq '.'

# Find all logs for a specific endpoint
cat logs/2025-10-23-combined.log | grep "/auth/login" | jq '.'

# Get response times over 1 second
cat logs/2025-10-23-combined.log | jq 'select(.responseTime > "1000ms")'
```

## Log Rotation and Cleanup

### Automatic Cleanup

By default, logs older than 30 days are automatically deleted when the application starts:

```typescript
// In main.ts
logger.cleanOldLogs(30); // Keep logs for 30 days
```

### Manual Cleanup

You can change the retention period:

```typescript
// Keep logs for 7 days
logger.cleanOldLogs(7);

// Keep logs for 90 days
logger.cleanOldLogs(90);
```

### Disable Automatic Cleanup

Comment out or remove the cleanup call in `main.ts`:

```typescript
// logger.cleanOldLogs(30); // Disabled
```

## Architecture

### Components

1. **CustomLoggerService** (`src/common/logger/logger.service.ts`)
   - Core logging functionality
   - File writing
   - Log formatting
   - Automatic cleanup

2. **LoggingInterceptor** (`src/common/interceptors/logging.interceptor.ts`)
   - Intercepts all HTTP requests/responses
   - Logs request/response details
   - Sanitizes sensitive data

3. **AllExceptionsFilter** (`src/common/filters/http-exception.filter.ts`)
   - Catches all unhandled exceptions
   - Logs error details
   - Returns formatted error responses

4. **LoggerModule** (`src/common/logger/logger.module.ts`)
   - Makes logger available globally
   - Manages logger dependencies

## Best Practices

### DO:
✅ Set appropriate context for each service  
✅ Log important business events  
✅ Include relevant data in log messages  
✅ Use appropriate log levels  
✅ Log errors with stack traces  

### DON'T:
❌ Log sensitive data (passwords, tokens) - already handled automatically  
❌ Over-log in production (use DEBUG/VERBOSE sparingly)  
❌ Log inside tight loops  
❌ Include PII (Personally Identifiable Information) without redaction  

## Performance Considerations

- **Asynchronous File Writing**: Logs are written synchronously for reliability
- **Console Output**: Minimal performance impact
- **File I/O**: Logs are appended, not overwritten
- **Production**: Consider using log aggregation services (ELK, Datadog, etc.)

## Troubleshooting

### Logs Not Appearing

1. Check if `logs/` directory exists
2. Verify file permissions
3. Check console for errors

### Large Log Files

1. Reduce log retention period
2. Adjust log levels in production
3. Implement log rotation using external tools

### Missing Logs

1. Ensure logger is injected properly
2. Check if context is set
3. Verify global interceptor is registered

## Integration with Monitoring Tools

The JSON format makes it easy to integrate with monitoring tools:

### ELK Stack (Elasticsearch, Logstash, Kibana)
```bash
# Use Filebeat to ship logs to Elasticsearch
```

### Datadog
```bash
# Point Datadog agent to the logs directory
```

### CloudWatch (AWS)
```bash
# Use CloudWatch agent to monitor log files
```

## Example Log Output

```
[2025-10-23T10:30:45.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/login",
  "ip": "::1",
  "userAgent": "PostmanRuntime/7.26.8",
  "body": { "email": "admin@example.com", "password": "***REDACTED***" }
}

[2025-10-23T10:30:45.234Z] [INFO] [AuthService] Validating employee: admin@example.com

[2025-10-23T10:30:45.345Z] [INFO] [AuthService] Employee validated successfully: admin@example.com

[2025-10-23T10:30:45.456Z] [INFO] [AuthService] Login successful for employee: admin@example.com

[2025-10-23T10:30:45.567Z] [INFO] [HTTP] {
  "type": "RESPONSE",
  "method": "POST",
  "url": "/auth/login",
  "statusCode": 200,
  "responseTime": "444ms"
}
```

## Summary

The logging system provides comprehensive visibility into your application's behavior, making debugging, monitoring, and auditing much easier. All logs are automatically organized, sanitized, and stored for future reference.

For questions or issues, refer to the source code in `src/common/`.
