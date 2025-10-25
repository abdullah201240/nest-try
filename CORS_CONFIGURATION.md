# CORS Configuration Guide

## Overview
Cross-Origin Resource Sharing (CORS) is configured in the NestJS backend to allow the Next.js frontend to communicate with the API securely.

## Configuration Location
**File**: `src/main.ts`

## Current Setup

### Development Configuration
The CORS is configured to allow requests from:
- `http://localhost:3000` - Next.js development server (default)
- `http://localhost:3001` - Alternative Next.js port
- `http://127.0.0.1:3000` - Alternative localhost format

### CORS Settings

```typescript
app.enableCors({
  origin: corsOrigins,              // Allowed origins (from .env)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,                // Allow cookies and authorization headers
  allowedHeaders: 'Content-Type, Accept, Authorization',
});
```

### Settings Explained

1. **origin**: 
   - Controls which domains can make requests to your API
   - Configured via `CORS_ORIGINS` environment variable
   - Comma-separated list of allowed origins

2. **methods**: 
   - Specifies which HTTP methods are allowed
   - Includes: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD

3. **credentials**: 
   - Set to `true` to allow:
     - Cookies
     - Authorization headers (JWT tokens)
     - HTTP authentication

4. **allowedHeaders**: 
   - Specifies which headers the client can send
   - Includes: Content-Type, Accept, Authorization

## Environment Variable Configuration

### File: `.env`

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

### Adding Production Origins

For production deployment, update `.env` with your production domain:

```env
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

## Testing CORS

### 1. Start the Backend
```bash
cd nest-try
pnpm run start:dev
```

You should see in the console:
```
Application is running on: http://localhost:8080
CORS enabled for origins: http://localhost:3000, http://localhost:3001, http://127.0.0.1:3000
```

### 2. Test with Frontend
```bash
cd product-dashboard
npm run dev
```

### 3. Verify CORS Headers

Open browser DevTools → Network tab, and check any API request headers:

**Request Headers:**
```
Origin: http://localhost:3000
```

**Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
```

## Common CORS Issues and Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Cause**: Frontend origin not in allowed list  
**Solution**: Add your frontend URL to `CORS_ORIGINS` in `.env`

### Issue 2: "Credentials mode is 'include' but Access-Control-Allow-Credentials is not true"
**Cause**: `credentials: true` not set  
**Solution**: Already configured in our setup

### Issue 3: Preflight OPTIONS request fails
**Cause**: OPTIONS method not allowed  
**Solution**: Already included in `methods` configuration

### Issue 4: Authorization header blocked
**Cause**: Authorization not in `allowedHeaders`  
**Solution**: Already included in our setup

## Security Best Practices

### Development
✅ Use specific origins (not `*`)  
✅ Enable credentials for JWT authentication  
✅ Allow only necessary HTTP methods  

### Production
✅ Use HTTPS origins only  
✅ Remove development localhost origins  
✅ Limit to specific production domains  
✅ Consider implementing rate limiting  

### Production Example

```typescript
// For production, use environment-specific configuration
const corsOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-app.com', 'https://www.your-app.com']
  : ['http://localhost:3000', 'http://localhost:3001'];

app.enableCors({
  origin: corsOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
});
```

## Advanced Configuration Options

### Allow All Origins (⚠️ Not Recommended for Production)
```typescript
app.enableCors({
  origin: '*',  // Allows any origin
  credentials: false,  // Must be false when origin is '*'
});
```

### Dynamic Origin Validation
```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = corsOrigins;
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

### Custom Headers
```typescript
app.enableCors({
  origin: corsOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Custom-Header'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Number'],  // Headers client can access
  maxAge: 3600,  // Preflight cache duration (seconds)
});
```

## Troubleshooting Commands

### Check if CORS is working
```bash
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -X OPTIONS \
  http://localhost:8080/auth/login -v
```

### Expected Response
```
< HTTP/1.1 204 No Content
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
< Access-Control-Allow-Credentials: true
```

## Integration with Frontend

The frontend (`product-dashboard`) is already configured to send credentials:

**File**: `lib/api.ts`
```typescript
const response = await fetch(`${this.baseUrl}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',  // Send cookies and auth headers
  body: JSON.stringify(credentials),
});
```

## Environment Variables Summary

### Backend (`.env`)
```env
PORT=8080
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Deployment Checklist

- [ ] Update `CORS_ORIGINS` with production frontend URL
- [ ] Use HTTPS for all production origins
- [ ] Remove development localhost origins
- [ ] Test CORS in production environment
- [ ] Monitor CORS-related errors in logs
- [ ] Consider implementing rate limiting
- [ ] Set up proper SSL/TLS certificates

## Additional Resources

- [NestJS CORS Documentation](https://docs.nestjs.com/security/cors)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [CORS npm package](https://www.npmjs.com/package/cors)

---

**Status**: ✅ CORS is now configured and ready to use!

Your backend will now accept requests from your Next.js frontend without CORS errors.
