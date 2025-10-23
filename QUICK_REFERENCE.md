# 🚀 Quick Reference Card

## Server-to-Server Access (API Key)

### Setup (One Time)
```bash
# Add to .env file
API_SECRET_KEY=your-super-secret-api-key-here
```

### Usage (Every Request)
```bash
# Get all employees
curl -H "x-api-key: your-super-secret-api-key-here" \
     http://localhost:8080/employees

# Get employee by ID
curl -H "x-api-key: your-super-secret-api-key-here" \
     http://localhost:8080/employees/1
```

### Code Examples

**JavaScript/Node.js:**
```javascript
fetch('http://localhost:8080/employees', {
  headers: { 'x-api-key': 'your-api-key' }
})
```

**Python:**
```python
requests.get('http://localhost:8080/employees', 
  headers={'x-api-key': 'your-api-key'})
```

**PHP:**
```php
curl_setopt($ch, CURLOPT_HTTPHEADER, ['x-api-key: your-api-key']);
```

---

## User Access (JWT Token)

### Login
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Use Token
```bash
GET /employees
Authorization: Bearer <your_token_here>
```

---

## Both Methods Work! 

✅ API Key → Fast, no login needed  
✅ JWT Token → User-based, secure, expires

Pick what works best for your use case!
