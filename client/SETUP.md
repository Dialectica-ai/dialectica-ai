# Setup Instructions for Dialectica AI Client

This document provides detailed instructions for setting up the client application.

## Environment Configuration

### Step 1: Copy Environment Template

```bash
cd client
cp .env.example .env.local
```

### Step 2: Configure Environment Variables

Open `.env.local` and configure the following:

#### Required Variables

1. **NEXT_PUBLIC_SOCKET_URL**
   - Development: `http://localhost:5003`
   - Production: Your deployed server URL
   - This connects the client to your Socket.io server

2. **NEXTAUTH_URL**
   - Development: `http://localhost:3000` (or `3001` if using different port)
   - Production: Your deployed application URL
   - This is required for NextAuth to work correctly

3. **NEXTAUTH_SECRET**
   - Generate a secure secret:
     ```bash
     openssl rand -base64 32
     ```
   - This encrypts session tokens - NEVER commit this to version control

4. **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**
   - Follow the [Google OAuth Setup Guide](#google-oauth-setup) below

## Google OAuth Setup

### Prerequisites
- A Google Cloud account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

### Steps

1. **Create or Select a Project**
   - Go to Google Cloud Console
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URI:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - For production, add:
     ```
     https://yourdomain.com/api/auth/callback/google
     ```

4. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local` file

## Verifying Your Setup

### 1. Check Environment File
```bash
# Make sure .env.local exists and has all required variables
ls -la .env.local
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Authentication
- Open http://localhost:3000
- Try signing in with Google
- If successful, you should be redirected to the home page

## Troubleshooting

### Socket Connection Issues
- Make sure the server is running on the port specified in `NEXT_PUBLIC_SOCKET_URL`
- Check that CORS is configured correctly in the server

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your application URL
- Check that Google OAuth credentials are correct
- Ensure redirect URIs are properly configured in Google Cloud Console
- Make sure `NEXTAUTH_SECRET` is set

### Common Errors

**Error: "socket connection failed"**
- Check if server is running: `cd server && npm run dev`
- Verify `NEXT_PUBLIC_SOCKET_URL` in `.env.local`

**Error: "NEXTAUTH_SECRET not set"**
- Generate a secret: `openssl rand -base64 32`
- Add it to `.env.local`

**Error: "Invalid client credentials"**
- Verify Google OAuth credentials
- Check redirect URIs in Google Cloud Console

## Security Notes

⚠️ **IMPORTANT**
- NEVER commit `.env.local` to version control
- Keep your `NEXTAUTH_SECRET` secure
- Regenerate secrets if they are exposed
- Use different secrets for development and production

## Next Steps

After setup is complete:
1. Review the main [README.md](../README.md)
2. Check [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines
3. Start building!

## Need Help?

- Open an issue with the "question" label
- Check existing issues for similar problems
- Reach out to maintainers

---

Last updated: October 15, 2025
