# MoneySplit Client

## Environment Setup

### 1. Create Environment File

Copy the `env.example` file to `.env` in the client directory:

```bash
cp env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: App Configuration
# NEXT_PUBLIC_APP_NAME=MoneySplit
# NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Environment Variables Explained

- **`NEXT_PUBLIC_API_URL`**: The URL where your backend server is running
  - Default: `http://localhost:3000`
  - Change this if your server runs on a different port or host

- **`NEXT_PUBLIC_APP_NAME`**: The name of your application
  - Default: `MoneySplit`

- **`NEXT_PUBLIC_APP_VERSION`**: The version of your application
  - Default: `1.0.0`

### 4. Important Notes

- **`NEXT_PUBLIC_` prefix**: Variables with this prefix are exposed to the browser
- **Restart required**: After changing `.env`, restart your Next.js development server
- **Git ignore**: The `.env` file is automatically ignored by Git for security

### 5. Development vs Production

**Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Production:**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 6. Usage in Components

The application automatically uses these environment variables. You can also import the config utility:

```javascript
import { config, getApiEndpoint, apiEndpoints } from '@/utils/config';

// Get the API URL
const apiUrl = config.apiUrl;

// Get a full API endpoint
const userEndpoint = getApiEndpoint('/api/users/123');

// Use predefined endpoints
const loginEndpoint = getApiEndpoint(apiEndpoints.users.login);
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Troubleshooting

- **API calls failing**: Check that `NEXT_PUBLIC_API_URL` points to your running backend server
- **Environment not loading**: Restart your Next.js development server after changing `.env`
- **CORS issues**: Ensure your backend server has CORS properly configured
