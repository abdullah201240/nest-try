# 🔐 Authentication System Summary

## Overview

This Employee Management API now supports **dual authentication** for maximum flexibility:

1. **JWT Token Authentication** - For employee login (web/mobile apps)
2. **API Key Authentication** - For server-to-server communication

---

## 🎯 Implementation Details

### Files Created

#### Auth Guards
- ✅ [`jwt-auth.guard.ts`](./src/auth/guards/jwt-auth.guard.ts) - JWT only authentication
- ✅ [`api-key.guard.ts`](./src/auth/guards/api-key.guard.ts) - API Key only authentication  
- ✅ [`jwt-or-api-key.guard.ts`](./src/auth/guards/jwt-or-api-key.guard.ts) - **Combined guard** (JWT OR API Key)

#### Decorators
- ✅ [`current-user.decorator.ts`](./src/auth/decorators/current-user.decorator.ts) - Extract logged-in user
- ✅ [`public.decorator.ts`](./src/auth/decorators/public.decorator.ts) - Mark routes as public

#### Documentation
- ✅ [`API_TESTING_GUIDE.md`](./API_TESTING_GUIDE.md) - User authentication guide
- ✅ [`SERVER_TO_SERVER_API_GUIDE.md`](./SERVER_TO_SERVER_API_GUIDE.md) - Server-to-server guide
- ✅ [`external-server-example.js`](./external-server-example.js) - Working code example

---

## 🚀 Quick Start

### 1. Add API Key to .env

```env
# Add this to your .env file
API_SECRET_KEY=your-super-secret-api-key-for-server-access
```

### 2. Access from Another Server

```javascript
// JavaScript/Node.js Example
const response = await fetch('http://localhost:8080/employees', {
  headers: {
    'x-api-key': 'your-super-secret-api-key-for-server-access'
  }
});

const employees = await response.json();
console.log(employees);
```

### 3. Access from User Login

```bash
# Step 1: Login
POST http://localhost:8080/auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}

# Step 2: Use token
GET http://localhost:8080/employees
Authorization: Bearer <your_access_token>
```

---

## 📊 Endpoint Protection Status

| Endpoint | Method | Authentication Required | Options |
|----------|--------|------------------------|---------|
| `/employees` | GET | ✅ Yes | JWT Token **OR** API Key |
| `/employees/:id` | GET | ✅ Yes | JWT Token **OR** API Key |
| `/employees` | POST | ❌ No | Public (for registration) |
| `/auth/login` | POST | ❌ No | Public |
| `/auth/refresh` | POST | ✅ Yes | Refresh Token |
| `/auth/logout` | POST | ✅ Yes | JWT Token |

---

## 🔑 Authentication Methods Comparison

### Method 1: JWT Token (For Users)

**Best for:** Web apps, mobile apps, browser-based access

```http
GET /employees
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Features:**
- ✅ User must login first
- ✅ Token expires (15 minutes)
- ✅ Can refresh token (7 days)
- ✅ Includes user information
- ✅ Checks if employee is active

---

### Method 2: API Key (For Servers)

**Best for:** Server-to-server communication, microservices, backend integrations

```http
GET /employees
x-api-key: your-super-secret-api-key-for-server-access
```

**Features:**
- ✅ No login required
- ✅ Never expires
- ✅ Simple header-based
- ✅ Perfect for automation
- ✅ Fast and efficient

---

## 🛡️ Security Features

### JWT Token Security
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Token expiration (15 minutes)
- ✅ Refresh token rotation
- ✅ Active employee verification
- ✅ Password never returned in responses

### API Key Security
- ✅ Stored in environment variables
- ✅ Server-side validation
- ✅ Configurable per environment
- ✅ Easy to rotate

---

## 📝 Example Usage

### JavaScript/Node.js
```javascript
const employees = await fetch('http://localhost:8080/employees', {
  headers: { 'x-api-key': 'your-api-key' }
}).then(res => res.json());
```

### Python
```python
import requests
headers = {'x-api-key': 'your-api-key'}
employees = requests.get('http://localhost:8080/employees', headers=headers).json()
```

### cURL
```bash
curl -H "x-api-key: your-api-key" http://localhost:8080/employees
```

### PHP
```php
$headers = ['x-api-key: your-api-key'];
$employees = curl_request('http://localhost:8080/employees', $headers);
```

---

## 🧪 Testing

### Test the working example
```bash
# Make sure your server is running first
pnpm start:dev

# In another terminal, run the example
node external-server-example.js
```

### Expected Output
```
🚀 Starting External Server API Test

=== Using Fetch API ===
✅ Success! Employees: [...]

=== Getting Employee ID: 1 ===
✅ Success! Employee: {...}

=== Testing Invalid API Key ===
❌ Expected error: { statusCode: 401, message: 'Invalid API Key' }

✅ All tests completed!
```

---

## 🔄 Migration Checklist

Before using the system, ensure:

- [ ] Run pending migrations: `pnpm migration:run`
- [ ] Add `API_SECRET_KEY` to `.env` file
- [ ] Add `JWT_SECRET` and `JWT_REFRESH_SECRET` to `.env`
- [ ] Test employee creation endpoint
- [ ] Test login endpoint
- [ ] Test protected endpoints with JWT
- [ ] Test protected endpoints with API Key

---

## 🆘 Troubleshooting

### Error: "API Key is missing"
**Solution:** Add `x-api-key` header to your request

### Error: "Invalid API Key"
**Solution:** Check your `.env` file has correct `API_SECRET_KEY`

### Error: "Unauthorized"
**Solution:** Either login and use JWT token, or use API key header

### Error: "Account is inactive"
**Solution:** Set `isActive: true` in database for the employee

---

## 📚 Documentation Links

- [User Authentication Guide](./API_TESTING_GUIDE.md)
- [Server-to-Server Guide](./SERVER_TO_SERVER_API_GUIDE.md)
- [Working Code Example](./external-server-example.js)

---

## ✅ What's Next?

Optional enhancements you can add:

1. **Rate Limiting** - Prevent API abuse
2. **API Key Scopes** - Different keys for different permissions
3. **Request Logging** - Track who's accessing what
4. **IP Whitelisting** - Only allow specific IPs
5. **Multiple API Keys** - Different keys for different servers
6. **API Key Expiration** - Set expiry dates for keys

---

**Your authentication system is production-ready!** 🎉
