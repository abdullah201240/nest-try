# Server-to-Server API Access Guide

## Overview

This API supports **two authentication methods** for accessing employee data:

1. **JWT Token Authentication** - For user login (employees)
2. **API Key Authentication** - For server-to-server communication

---

## API Key Authentication (Server-to-Server)

### Configuration

Add the API secret key to your `.env` file:

```env
API_SECRET_KEY=your-super-secret-api-key-for-server-access
```

⚠️ **Security Note:** Keep this key secure and never expose it in client-side code!

---

### How to Use API Key

Include the API key in the request header `x-api-key`:

```http
GET http://localhost:8080/employees
x-api-key: your-super-secret-api-key-for-server-access
```

---

## Example Requests

### ✅ Option 1: Using API Key (Server-to-Server)

#### Get All Employees

```bash
curl -X GET http://localhost:8080/employees \
  -H "x-api-key: your-super-secret-api-key-for-server-access"
```

#### Get Employee by ID

```bash
curl -X GET http://localhost:8080/employees/1 \
  -H "x-api-key: your-super-secret-api-key-for-server-access"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "empId": "EMP001",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+1-234-567-8900",
    "personalMobileNumber": "+1-234-567-8901",
    "personalEmail": "john.personal@gmail.com",
    "gender": "male",
    "religion": "Christian",
    "dob": "1990-01-15T00:00:00.000Z",
    "designation": "Software Engineer",
    "department": "Engineering",
    "image": "https://example.com/photo.jpg",
    "isActive": true,
    "createdAt": "2025-10-23T15:31:58.000Z",
    "updatedAt": "2025-10-23T15:31:58.000Z"
  }
]
```

---

### ✅ Option 2: Using JWT Token (User Login)

#### Step 1: Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@company.com","password":"SecureP@ss123"}'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "employee": { ... },
  "expiresIn": 900
}
```

#### Step 2: Access with Token

```bash
curl -X GET http://localhost:8080/employees \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Node.js/JavaScript Example (Another Server)

### Using Axios

```javascript
const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:8080';
const API_SECRET_KEY = 'your-super-secret-api-key-for-server-access';

// Get all employees
async function getEmployees() {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`, {
      headers: {
        'x-api-key': API_SECRET_KEY
      }
    });
    
    console.log('Employees:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Get employee by ID
async function getEmployeeById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees/${id}`, {
      headers: {
        'x-api-key': API_SECRET_KEY
      }
    });
    
    console.log('Employee:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
getEmployees();
getEmployeeById(1);
```

### Using Fetch (Native)

```javascript
const API_BASE_URL = 'http://localhost:8080';
const API_SECRET_KEY = 'your-super-secret-api-key-for-server-access';

// Get all employees
async function getEmployees() {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'GET',
    headers: {
      'x-api-key': API_SECRET_KEY
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const employees = await response.json();
  console.log('Employees:', employees);
  return employees;
}

// Usage
getEmployees().catch(console.error);
```

---

## Python Example

### Using Requests

```python
import requests

API_BASE_URL = 'http://localhost:8080'
API_SECRET_KEY = 'your-super-secret-api-key-for-server-access'

def get_employees():
    headers = {
        'x-api-key': API_SECRET_KEY
    }
    
    response = requests.get(f'{API_BASE_URL}/employees', headers=headers)
    
    if response.status_code == 200:
        employees = response.json()
        print('Employees:', employees)
        return employees
    else:
        print(f'Error: {response.status_code}')
        print(response.json())
        return None

def get_employee_by_id(employee_id):
    headers = {
        'x-api-key': API_SECRET_KEY
    }
    
    response = requests.get(f'{API_BASE_URL}/employees/{employee_id}', headers=headers)
    
    if response.status_code == 200:
        employee = response.json()
        print('Employee:', employee)
        return employee
    else:
        print(f'Error: {response.status_code}')
        print(response.json())
        return None

# Usage
get_employees()
get_employee_by_id(1)
```

---

## PHP Example

```php
<?php

$apiBaseUrl = 'http://localhost:8080';
$apiSecretKey = 'your-super-secret-api-key-for-server-access';

function getEmployees($apiBaseUrl, $apiSecretKey) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $apiBaseUrl . '/employees');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-key: ' . $apiSecretKey
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $employees = json_decode($response, true);
        print_r($employees);
        return $employees;
    } else {
        echo "Error: $httpCode\n";
        echo $response;
        return null;
    }
}

// Usage
getEmployees($apiBaseUrl, $apiSecretKey);
```

---

## Error Responses

### Missing API Key

```json
{
  "statusCode": 401,
  "message": "API Key is missing"
}
```

### Invalid API Key

```json
{
  "statusCode": 401,
  "message": "Invalid API Key"
}
```

### Invalid JWT Token (when using token instead of API key)

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## Security Best Practices

1. ✅ Store API key in environment variables, never in code
2. ✅ Use HTTPS in production
3. ✅ Rotate API keys regularly
4. ✅ Monitor API key usage
5. ✅ Use different API keys for different servers
6. ✅ Implement rate limiting (future enhancement)
7. ✅ Log all API key access attempts

---

## Testing

### Test with Invalid API Key

```bash
curl -X GET http://localhost:8080/employees \
  -H "x-api-key: wrong-key"
```

**Response:** `401 Invalid API Key`

### Test without Authentication

```bash
curl -X GET http://localhost:8080/employees
```

**Response:** `401 Invalid credentials. Please provide a valid JWT token or API key`

### Test with Valid API Key

```bash
curl -X GET http://localhost:8080/employees \
  -H "x-api-key: your-super-secret-api-key-for-server-access"
```

**Response:** `200 OK` with employee list

---

## Postman Setup

1. **Create a new request:**
   - Method: GET
   - URL: `http://localhost:8080/employees`

2. **Add API Key Header:**
   - Go to "Headers" tab
   - Add new header:
     - Key: `x-api-key`
     - Value: `your-super-secret-api-key-for-server-access`

3. **Send the request** - You should get the employee list!

---

## Summary

Your API now supports **dual authentication**:

- 🔑 **API Key** (`x-api-key` header) - For server-to-server communication
- 🎫 **JWT Token** (`Authorization: Bearer` header) - For user authentication

Both methods work on the same endpoints!
