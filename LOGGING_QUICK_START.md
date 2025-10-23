# Logging System - Quick Start

## What Was Implemented

A comprehensive logging system for your NestJS application that logs every API request, response, and error.

## Files Created

1. **src/common/logger/logger.service.ts** - Core logging service
2. **src/common/logger/logger.module.ts** - Logger module
3. **src/common/interceptors/logging.interceptor.ts** - HTTP request/response interceptor
4. **src/common/filters/http-exception.filter.ts** - Global exception filter
5. **src/common/index.ts** - Exports for common modules
6. **LOGGING_GUIDE.md** - Complete documentation

## Files Modified

1. **src/main.ts** - Added global logger, interceptor, and exception filter
2. **src/app.module.ts** - Imported LoggerModule
3. **src/auth/auth.service.ts** - Added logging to all methods
4. **src/employee/employee.service.ts** - Added logging to all methods
5. **README.md** - Added logging system documentation

## How It Works

### 1. Automatic HTTP Logging
Every API request and response is automatically logged with:
- Method (GET, POST, etc.)
- URL
- Request body (with sensitive data redacted)
- Response data
- Response time
- Status code
- User agent and IP

### 2. Console Output (Color-coded)
- 🔴 ERROR - Red
- 🟡 WARN - Yellow
- 🟢 INFO - Green
- 🔵 DEBUG - Cyan
- 🟣 VERBOSE - Magenta

### 3. File Output
Logs are saved to `logs/` directory:
- `YYYY-MM-DD-error.log` - Only errors
- `YYYY-MM-DD-warn.log` - Only warnings
- `YYYY-MM-DD-info.log` - Only info
- `YYYY-MM-DD-debug.log` - Only debug
- `YYYY-MM-DD-verbose.log` - Only verbose
- `YYYY-MM-DD-combined.log` - All logs

### 4. Sensitive Data Protection
Automatically redacts:
- Passwords
- Access tokens
- Refresh tokens
- Authorization headers
- API keys
- Cookies

### 5. Service Logging
Services now log important events:
- User login/logout
- Employee creation
- Data validation
- Errors and warnings

## Usage Examples

### Starting the Application
```bash
pnpm run start:dev
```

You'll see colored logs in the console showing:
- Application startup
- Database connection
- Port binding
- All incoming requests

### Viewing Logs

**Console:**
Just run the app and watch the terminal

**Files:**
```bash
# View today's logs
cat logs/2025-10-23-combined.log

# View only errors
cat logs/2025-10-23-error.log

# Follow logs in real-time
tail -f logs/2025-10-23-combined.log
```

### Testing the Logging

1. Start the application:
```bash
pnpm run start:dev
```

2. Make an API request (e.g., login):
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

3. Check the console - you'll see:
   - Request log (green)
   - Service logs (green)
   - Response log (green)

4. Check the log files:
```bash
cat logs/2025-10-23-combined.log
```

## What Gets Logged

### Every API Call Logs:
✅ Incoming request details  
✅ Request body (sanitized)  
✅ Request headers (sanitized)  
✅ Service-level events  
✅ Response data (sanitized)  
✅ Response time  
✅ Status code  

### Example Log Output:

```json
{
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/login",
  "ip": "::1",
  "userAgent": "curl/7.68.0",
  "body": {
    "email": "admin@example.com",
    "password": "***REDACTED***"
  },
  "timestamp": "2025-10-23T10:30:45.123Z"
}
```

```json
{
  "type": "RESPONSE",
  "method": "POST",
  "url": "/auth/login",
  "statusCode": 200,
  "responseTime": "245ms",
  "response": {
    "accessToken": "***REDACTED***",
    "employee": { "id": 1, "email": "admin@example.com" }
  },
  "timestamp": "2025-10-23T10:30:45.368Z"
}
```

## Benefits

1. **Full Audit Trail** - Know exactly what happened and when
2. **Easy Debugging** - See request/response data for every call
3. **Performance Monitoring** - Track response times
4. **Security** - Sensitive data is automatically hidden
5. **Compliance** - Keep logs for auditing purposes
6. **Production Ready** - Automatic log rotation and cleanup

## Log Retention

Logs older than 30 days are automatically deleted on application startup.

To change retention period, edit `src/main.ts`:
```typescript
logger.cleanOldLogs(30); // Change to desired number of days
```

## Advanced Usage

### Add Logging to Your Service

```typescript
import { CustomLoggerService } from '../common';

@Injectable()
export class YourService {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('YourService');
  }

  async yourMethod() {
    this.logger.log('Starting operation...');
    this.logger.warn('Warning message');
    this.logger.error('Error occurred', stackTrace);
  }
}
```

## Next Steps

1. **Start the application** to see logging in action
2. **Make some API calls** and watch the logs
3. **Check the logs directory** to see log files
4. **Read LOGGING_GUIDE.md** for complete documentation

## Troubleshooting

**Problem:** No log files created  
**Solution:** Check if `logs/` directory exists and has write permissions

**Problem:** Too many log files  
**Solution:** Adjust retention period in `main.ts`

**Problem:** Logs not showing in console  
**Solution:** Ensure application is running in dev mode

## Summary

Your NestJS application now has enterprise-grade logging! Every API request, response, and error is automatically tracked and saved. You can monitor your application in real-time through console logs or review historical data through log files.

For complete details, see [LOGGING_GUIDE.md](./LOGGING_GUIDE.md)
