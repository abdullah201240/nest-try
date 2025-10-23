# Log Output Examples

This document shows real examples of what the logs look like in different scenarios.

## Console Output Example

When you run the application, you'll see colored output like this:

```
[2025-10-23T10:30:40.123Z] [INFO] [Bootstrap] Application is running on: http://localhost:8080
[2025-10-23T10:30:40.124Z] [INFO] [Bootstrap] Logging system initialized successfully
[2025-10-23T10:30:45.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/login",
  "ip": "::1",
  "userAgent": "PostmanRuntime/7.26.8",
  "body": {
    "email": "admin@example.com",
    "password": "***REDACTED***"
  },
  "headers": {
    "content-type": "application/json",
    "host": "localhost:8080"
  },
  "timestamp": "2025-10-23T10:30:45.123Z"
}
[2025-10-23T10:30:45.234Z] [INFO] [AuthService] Validating employee: admin@example.com
[2025-10-23T10:30:45.345Z] [INFO] [AuthService] Employee validated successfully: admin@example.com
[2025-10-23T10:30:45.456Z] [INFO] [AuthService] Login request for employee: admin@example.com (ID: 1)
[2025-10-23T10:30:45.567Z] [INFO] [AuthService] Login successful for employee: admin@example.com
[2025-10-23T10:30:45.678Z] [INFO] [HTTP] {
  "type": "RESPONSE",
  "method": "POST",
  "url": "/auth/login",
  "statusCode": 200,
  "responseTime": "555ms",
  "response": {
    "accessToken": "***REDACTED***",
    "refreshToken": "***REDACTED***",
    "employee": {
      "id": 1,
      "empId": "EMP001",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User"
    },
    "expiresIn": 900
  },
  "timestamp": "2025-10-23T10:30:45.678Z"
}
```

## Successful Employee Creation

```
[2025-10-23T10:35:12.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/employees",
  "ip": "::1",
  "body": {
    "empId": "EMP002",
    "email": "john.doe@example.com",
    "password": "***REDACTED***",
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1990-01-01"
  }
}
[2025-10-23T10:35:12.234Z] [INFO] [EmployeeService] Creating new employee with empId: EMP002
[2025-10-23T10:35:12.456Z] [INFO] [EmployeeService] Employee created successfully - ID: 2, empId: EMP002
[2025-10-23T10:35:12.567Z] [INFO] [HTTP] {
  "type": "RESPONSE",
  "method": "POST",
  "url": "/employees",
  "statusCode": 201,
  "responseTime": "444ms"
}
```

## Failed Login Attempt (Wrong Password)

```
[2025-10-23T10:40:23.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/login",
  "body": {
    "email": "admin@example.com",
    "password": "***REDACTED***"
  }
}
[2025-10-23T10:40:23.234Z] [INFO] [AuthService] Validating employee: admin@example.com
[2025-10-23T10:40:23.345Z] [WARN] [AuthService] Invalid password attempt for: admin@example.com
[2025-10-23T10:40:23.456Z] [ERROR] [HTTP] {
  "type": "ERROR",
  "method": "POST",
  "url": "/auth/login",
  "statusCode": 401,
  "responseTime": "333ms",
  "error": {
    "message": "Invalid credentials",
    "stack": "UnauthorizedException: Invalid credentials\n    at LocalStrategy.validate...",
    "name": "UnauthorizedException"
  },
  "timestamp": "2025-10-23T10:40:23.456Z"
}
```

## Duplicate Employee Error

```
[2025-10-23T10:45:34.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/employees",
  "body": {
    "empId": "EMP001",
    "email": "duplicate@example.com",
    "password": "***REDACTED***"
  }
}
[2025-10-23T10:45:34.234Z] [INFO] [EmployeeService] Creating new employee with empId: EMP001
[2025-10-23T10:45:34.345Z] [WARN] [EmployeeService] Duplicate employee ID: EMP001
[2025-10-23T10:45:34.456Z] [ERROR] [HTTP] {
  "type": "ERROR",
  "method": "POST",
  "url": "/employees",
  "statusCode": 409,
  "responseTime": "333ms",
  "error": {
    "message": "Employee ID already exists",
    "name": "ConflictException"
  }
}
```

## Get All Employees (Protected Route)

```
[2025-10-23T10:50:45.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "GET",
  "url": "/employees",
  "headers": {
    "authorization": "***REDACTED***"
  }
}
[2025-10-23T10:50:45.234Z] [INFO] [EmployeeService] Fetching all employees
[2025-10-23T10:50:45.345Z] [INFO] [EmployeeService] Found 5 employees
[2025-10-23T10:50:45.456Z] [INFO] [HTTP] {
  "type": "RESPONSE",
  "method": "GET",
  "url": "/employees",
  "statusCode": 200,
  "responseTime": "333ms",
  "response": [
    {
      "id": 1,
      "empId": "EMP001",
      "email": "admin@example.com",
      "firstName": "Admin"
    },
    {
      "id": 2,
      "empId": "EMP002",
      "email": "john.doe@example.com",
      "firstName": "John"
    }
  ]
}
```

## Token Refresh

```
[2025-10-23T10:55:56.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/refresh",
  "body": {
    "refreshToken": "***REDACTED***"
  }
}
[2025-10-23T10:55:56.234Z] [INFO] [AuthService] Refresh token request for employee ID: 1
[2025-10-23T10:55:56.345Z] [INFO] [AuthService] Tokens refreshed successfully for employee: admin@example.com
[2025-10-23T10:55:56.456Z] [INFO] [HTTP] {
  "type": "RESPONSE",
  "method": "POST",
  "url": "/auth/refresh",
  "statusCode": 200,
  "responseTime": "333ms",
  "response": {
    "accessToken": "***REDACTED***",
    "refreshToken": "***REDACTED***"
  }
}
```

## Logout

```
[2025-10-23T11:00:07.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/logout",
  "headers": {
    "authorization": "***REDACTED***"
  }
}
[2025-10-23T11:00:07.234Z] [INFO] [AuthService] Logout request for employee ID: 1
[2025-10-23T11:00:07.345Z] [INFO] [AuthService] Logout successful for employee ID: 1
[2025-10-23T11:00:07.456Z] [INFO] [HTTP] {
  "type": "RESPONSE",
  "method": "POST",
  "url": "/auth/logout",
  "statusCode": 200,
  "responseTime": "333ms",
  "response": {
    "message": "Logged out successfully"
  }
}
```

## Inactive Account Attempt

```
[2025-10-23T11:05:18.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "POST",
  "url": "/auth/login",
  "body": {
    "email": "inactive@example.com",
    "password": "***REDACTED***"
  }
}
[2025-10-23T11:05:18.234Z] [INFO] [AuthService] Validating employee: inactive@example.com
[2025-10-23T11:05:18.345Z] [WARN] [AuthService] Inactive account login attempt: inactive@example.com
[2025-10-23T11:05:18.456Z] [ERROR] [HTTP] {
  "type": "ERROR",
  "method": "POST",
  "url": "/auth/login",
  "statusCode": 403,
  "responseTime": "333ms",
  "error": {
    "message": "Your account is inactive. Please contact administrator.",
    "name": "ForbiddenException"
  }
}
```

## API Key Authentication (Server-to-Server)

```
[2025-10-23T11:10:29.123Z] [INFO] [HTTP] {
  "type": "REQUEST",
  "method": "GET",
  "url": "/employees",
  "headers": {
    "x-api-key": "***REDACTED***",
    "user-agent": "External-Service/1.0"
  }
}
[2025-10-23T11:10:29.234Z] [INFO] [EmployeeService] Fetching all employees
[2025-10-23T11:10:29.345Z] [INFO] [EmployeeService] Found 5 employees
[2025-10-23T11:10:29.456Z] [INFO] [HTTP] {
  "type": "RESPONSE",
  "method": "GET",
  "url": "/employees",
  "statusCode": 200,
  "responseTime": "333ms"
}
```

## File Log Format (JSON)

Each line in the log files is a complete JSON object:

**2025-10-23-combined.log:**
```json
{"timestamp":"2025-10-23T10:30:45.123Z","level":"INFO","context":"HTTP","message":"{\"type\":\"REQUEST\",\"method\":\"POST\",\"url\":\"/auth/login\"}"}
{"timestamp":"2025-10-23T10:30:45.234Z","level":"INFO","context":"AuthService","message":"Validating employee: admin@example.com"}
{"timestamp":"2025-10-23T10:30:45.345Z","level":"INFO","context":"AuthService","message":"Employee validated successfully: admin@example.com"}
{"timestamp":"2025-10-23T10:30:45.456Z","level":"INFO","context":"AuthService","message":"Login successful for employee: admin@example.com"}
{"timestamp":"2025-10-23T10:30:45.567Z","level":"INFO","context":"HTTP","message":"{\"type\":\"RESPONSE\",\"statusCode\":200,\"responseTime\":\"444ms\"}"}
```

**2025-10-23-error.log:**
```json
{"timestamp":"2025-10-23T10:40:23.456Z","level":"ERROR","context":"HTTP","message":"{\"type\":\"ERROR\",\"statusCode\":401,\"error\":{\"message\":\"Invalid credentials\"}}","trace":"UnauthorizedException: Invalid credentials\n    at LocalStrategy.validate..."}
{"timestamp":"2025-10-23T10:45:34.456Z","level":"ERROR","context":"HTTP","message":"{\"type\":\"ERROR\",\"statusCode\":409,\"error\":{\"message\":\"Employee ID already exists\"}}"}
```

**2025-10-23-warn.log:**
```json
{"timestamp":"2025-10-23T10:40:23.345Z","level":"WARN","context":"AuthService","message":"Invalid password attempt for: admin@example.com"}
{"timestamp":"2025-10-23T10:45:34.345Z","level":"WARN","context":"EmployeeService","message":"Duplicate employee ID: EMP001"}
{"timestamp":"2025-10-23T11:05:18.345Z","level":"WARN","context":"AuthService","message":"Inactive account login attempt: inactive@example.com"}
```

## Performance Tracking

You can easily see slow API calls:

```
[2025-10-23T11:15:30.123Z] [INFO] [HTTP] Response: 1234ms  ← Slow!
[2025-10-23T11:15:31.123Z] [INFO] [HTTP] Response: 45ms    ← Fast
[2025-10-23T11:15:32.123Z] [INFO] [HTTP] Response: 89ms    ← Fast
[2025-10-23T11:15:33.123Z] [INFO] [HTTP] Response: 2567ms  ← Slow!
```

## Summary

The logging system provides complete visibility into:
- ✅ Every API request and response
- ✅ Authentication events (login, logout, refresh)
- ✅ Business logic events (employee creation, queries)
- ✅ Errors and warnings with full context
- ✅ Performance metrics (response times)
- ✅ Security events (failed logins, inactive accounts)

All with automatic sensitive data redaction for security!
