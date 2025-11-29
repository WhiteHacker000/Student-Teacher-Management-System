# Frontend-Backend Connection Setup

## Backend URL
The frontend is now connected to the deployed backend at:
```
https://student-teacher-management-system.onrender.com
```

## Configuration Files

### 1. `.env` File
Located in `frontend/.env`, this file contains the backend API URL:
```
VITE_API_URL=https://student-teacher-management-system.onrender.com
```

**Note**: This file is gitignored and won't be committed to version control. Each developer needs to create their own `.env` file.

### 2. `.env.example` File
Contains example environment variables. Copy this to `.env` to get started:
```bash
cd frontend
cp .env.example .env
```

### 3. `vite.config.js`
The Vite proxy configuration has been updated to use the `VITE_API_URL` environment variable:
- In development: proxies `/api` requests to the deployed backend
- Adds `changeOrigin: true` to handle CORS
- Adds `secure: false` to allow HTTPS connections

## How It Works

1. **API Service** (`frontend/src/services/api.js`):
   - Reads the `VITE_API_URL` environment variable
   - All API calls use this base URL
   - Automatically adds authentication tokens to requests

2. **Vite Proxy**:
   - Proxies all `/api/*` requests to the backend
   - Handles CORS issues during development
   - Seamlessly works with the deployed backend

## Starting the Frontend

To start the frontend development server:

```bash
cd frontend
npm install  # if you haven't already
npm run dev
```

The frontend will now make API calls to your deployed backend on Render.

## Testing the Connection

Once the dev server is running:

1. Open the app in your browser (usually `http://localhost:5173`)
2. Try logging in or registering
3. Check the browser's Network tab (F12 → Network) to see API requests
4. Verify that requests are going to `https://student-teacher-management-system.onrender.com/api/*`

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your backend has CORS enabled for the frontend origin. Check your backend's CORS configuration.

### Environment Variables Not Loading
- Make sure the `.env` file is in the `frontend` directory
- Restart the Vite dev server after changing `.env` files
- Environment variables must be prefixed with `VITE_` to be accessible in the frontend

### Connection Refused
- Verify the backend is running on Render: https://student-teacher-management-system.onrender.com
- Check if the backend health endpoint is accessible
- Ensure the backend is not in a sleeping state (Render's free tier sleeps after inactivity)

## Production Build

For production builds, the environment variable will be baked into the bundle:

```bash
npm run build
```

The built files will be in the `dist` directory and will use the backend URL from the `.env` file.
