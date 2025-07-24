# Railway Deployment Guide

## Problem
The deployment was failing due to native dependencies (USB, secp256k1) that require Python and build tools to compile during installation.

## Solution
We've created multiple deployment configurations to handle this issue:

### Option 1: Multi-stage Docker with Nginx (Recommended)
- Uses `Dockerfile` (main file)
- Builds the app and serves it with Nginx
- More efficient and production-ready
- Exposes port 80

### Option 2: Simple Node.js Docker
- Uses `Dockerfile.simple`
- Builds the app and serves it with `serve` package
- Simpler configuration
- Exposes port 3000

## Deployment Steps

### 1. Choose Your Dockerfile
If you want to use the simple version, rename it:
```bash
mv Dockerfile.simple Dockerfile
```

### 2. Deploy to Railway
1. Push your code to GitHub
2. Connect your repository to Railway
3. Railway will automatically detect the Dockerfile and use it
4. The build should complete successfully

### 3. Environment Variables (if needed)
Add these to your Railway project:
- `NODE_ENV=production`
- `SKIP_USB_INSTALL=true`

## What We Fixed

### 1. Native Dependencies
- Added `--ignore-optional` flag to skip problematic optional dependencies
- Set environment variables to skip USB installation
- Installed necessary build tools (Python, make, g++)

### 2. Build Optimization
- Used multi-stage builds to reduce final image size
- Added proper caching for static assets
- Configured health checks

### 3. Production Server
- Nginx configuration with proper routing for SPA
- Security headers
- Gzip compression
- Static asset caching

## Troubleshooting

If you still encounter issues:

1. **Try the simple Dockerfile**:
   ```bash
   mv Dockerfile.simple Dockerfile
   ```

2. **Check Railway logs** for specific error messages

3. **Verify your package.json** has the correct build script:
   ```json
   "build": "tsc -b && vite build"
   ```

4. **Make sure all files are committed**:
   - Dockerfile
   - .dockerignore
   - railway.json (optional)
   - nginx.conf (if using main Dockerfile)

## Alternative: Vercel/Netlify
If Railway continues to have issues, consider:
- **Vercel**: Excellent for React apps, handles builds automatically
- **Netlify**: Similar to Vercel, great for static sites

Both platforms handle native dependencies much better than Railway for frontend applications. 