# MediCare - Smart Medicine Reminder System

## Netlify Deployment Guide

This guide will help you deploy the MediCare application to Netlify.

### Prerequisites

1. A [Netlify](https://netlify.com) account
2. An external database (SQLite won't work on Netlify's serverless environment)

### Database Setup (Required)

Since Netlify uses serverless functions, you need an external database. Choose one:

#### Option 1: Supabase (Recommended - Free Tier Available)
1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database → Connection string → URI
4. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password
5. Set `DATABASE_URL` in Netlify environment variables

#### Option 2: Neon (Free Tier Available)
1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string
4. Set `DATABASE_URL` in Netlify environment variables

#### Option 3: PlanetScale (Free Tier Available)
1. Go to [PlanetScale](https://planetscale.com) and create a free account
2. Create a new database
3. Get the connection string
4. Set `DATABASE_URL` in Netlify environment variables

### Deployment Steps

#### Method 1: Deploy via Netlify Dashboard (Recommended for Zip Upload)

1. **Prepare Environment Variables**
   - Copy `.env.example` to `.env`
   - Set up your external database and get the connection string
   - Generate a secure JWT secret: `openssl rand -base64 32`

2. **Upload the Zip File**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the zip file or select it
   - Wait for the build to complete

3. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add the following:
     - `DATABASE_URL`: Your database connection string
     - `JWT_SECRET`: Your secure random string (generate with `openssl rand -base64 32`)

4. **Trigger Redeploy**
   - Go to Deploys → Trigger Deploy → Deploy Site
   - This will apply the environment variables

#### Method 2: Deploy via Git (Recommended for Continuous Deployment)

1. **Push to GitHub/GitLab/Bitbucket**
   - Create a new repository
   - Push this project to the repository

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select the repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Netlify will auto-detect Next.js

4. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add `DATABASE_URL` and `JWT_SECRET`

5. **Deploy**
   - Click "Deploy Site"
   - Netlify will build and deploy automatically

### Post-Deployment

1. **Run Database Migrations**
   - After first deployment, you need to push the schema to your database
   - For Supabase/Neon: Run `npx prisma db push` locally with your production DATABASE_URL
   - Or use Prisma migrate: `npx prisma migrate deploy`

2. **Test Your Application**
   - Visit your Netlify URL
   - Create a new account
   - Test all features

### Troubleshooting

#### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify `DATABASE_URL` is set correctly

#### Database Connection Issues
- Verify your database allows external connections
- Check if SSL is required (add `?sslmode=require` to PostgreSQL URLs)
- Ensure the database exists and is accessible

#### API Routes Not Working
- Netlify functions have a 10-26 second timeout
- Check function logs in Netlify dashboard

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Database connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |

### Project Structure

```
medicare/
├── prisma/              # Database schema
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages & API routes
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configurations
│   └── utils/           # Helper functions
├── netlify.toml         # Netlify configuration
├── next.config.ts       # Next.js configuration
└── package.json         # Dependencies
```

### Features

- User Authentication (Signup/Login)
- Medicine Tracking & Reminders
- AI Health Assistant
- Emergency Contacts
- Status Tracking
- Modern Responsive UI

### Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- shadcn/ui Components
- JWT Authentication

### Support

If you encounter any issues during deployment, check:
1. Netlify build logs
2. Browser console for errors
3. Database connection status

---

© 2024 MediCare. All rights reserved.
