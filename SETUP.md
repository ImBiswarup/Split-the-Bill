# MoneySplit Authentication Setup Guide

This guide will help you set up the complete authentication system with both traditional email/password and Google OAuth support.

## 🚀 Features

- **Traditional Authentication**: Email/password signup and login
- **Google OAuth**: One-click sign-in with Google accounts
- **Modern UI**: Beautiful, responsive authentication interface
- **Secure**: JWT tokens, password hashing, and OAuth integration
- **Database Integration**: Automatic user creation and management

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud Console account (for OAuth)

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Database Setup

#### Option A: Using Prisma (Recommended)
```bash
cd server
npx prisma generate
npx prisma db push
```

#### Option B: Manual Migration
If you have an existing database, run the migration script:
```bash
cd server
node migrate-db.js
```

### 3. Environment Configuration

#### Client Environment (`.env.local`)
Copy `env.example` to `.env.local` and fill in:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Server Environment (`.env`)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/moneysplitter"

# JWT
JWT_SECRET=your-jwt-secret-key

# Server
PORT=5000
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your environment files

### 5. Database Schema

The updated schema includes:
- `password`: Optional (for OAuth users)
- `image`: Profile picture from OAuth
- `provider`: OAuth provider (e.g., "google")
- `providerId`: OAuth provider user ID

### 6. Running the Application

#### Development Mode
```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev
```

#### Production Mode
```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

## 🔐 Authentication Flow

### Traditional Login/Signup
1. User enters email/password
2. Server validates credentials
3. JWT token generated and stored
4. User redirected to dashboard

### Google OAuth
1. User clicks "Continue with Google"
2. Google OAuth flow initiated
3. User data sent to backend
4. User created/updated in database
5. JWT token generated
6. User redirected to dashboard

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **OAuth Security**: Google's secure authentication
- **Input Validation**: Server-side validation
- **HTTPS**: Required in production

## 🎨 UI Features

- **Responsive Design**: Works on all devices
- **Modern Aesthetics**: Glassmorphism and gradients
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Proper labels and focus states
- **Error Handling**: Clear error messages

## 🔧 Troubleshooting

### Common Issues

1. **Google OAuth not working**
   - Check environment variables
   - Verify redirect URIs in Google Console
   - Check browser console for errors

2. **Database connection issues**
   - Verify DATABASE_URL format
   - Check PostgreSQL is running
   - Ensure database exists

3. **JWT errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure consistent secret across restarts

### Debug Mode

Enable debug logging:
```env
DEBUG=next-auth:*
```

## 📱 API Endpoints

### Authentication
- `POST /api/users/login` - Traditional login
- `POST /api/users/signup` - Traditional signup
- `POST /api/users/auth/google` - Google OAuth handler

### User Management
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🚀 Deployment

### Vercel (Client)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Render/Heroku (Server)
1. Set environment variables
2. Deploy from Git
3. Ensure database is accessible

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs
3. Verify environment configuration
4. Test with minimal setup

## 🔄 Updates

To update the authentication system:
1. Pull latest changes
2. Run database migrations
3. Update environment variables if needed
4. Restart services

---

**Note**: Always use strong, unique secrets in production and never commit sensitive information to version control.
