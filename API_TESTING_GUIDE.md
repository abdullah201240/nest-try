# API Authentication Testing Guide

## Protected Endpoints

The following employee endpoints now require authentication:

### ❌ Without Authentication (Will Fail)

```bash
# Get all employees - UNAUTHORIZED
GET http://localhost:8080/employees

# Get employee by ID - UNAUTHORIZED
GET http://localhost:8080/employees/1
```

**Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### ✅ With Authentication (Will Succeed)

#### Step 1: Login to get access token

```bash
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "john.doe@company.com",
  "password": "SecureP@ss123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": { ... },
  "expiresIn": 900
}
```

#### Step 2: Use access token to access protected endpoints

```bash
# Get all employees - SUCCESS
GET http://localhost:8080/employees
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Get employee by ID - SUCCESS
GET http://localhost:8080/employees/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "empId": "EMP001",
    "name": "John Doe",
    "email": "john.doe@company.com",
    ...
  }
]
```

---

## Public Endpoints (No Authentication Required)

The following endpoints remain public:

- `POST /employees` - Create new employee (registration)
- `POST /auth/login` - Employee login
- `POST /auth/refresh` - Refresh access token

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@company.com","password":"SecureP@ss123"}'
```

### Get Employees (Protected)
```bash
curl -X GET http://localhost:8080/employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## Testing with Postman

1. **Login Request:**
   - Method: POST
   - URL: `http://localhost:8080/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "john.doe@company.com",
       "password": "SecureP@ss123"
     }
     ```
   - Copy the `accessToken` from response

2. **Protected Request:**
   - Method: GET
   - URL: `http://localhost:8080/employees`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer YOUR_ACCESS_TOKEN`

---

## Token Expiration

- **Access Token:** Expires in 15 minutes
- **Refresh Token:** Expires in 7 days

When access token expires, use the refresh token endpoint:

```bash
POST http://localhost:8080/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

This will return new access and refresh tokens.
