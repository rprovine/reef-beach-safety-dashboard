# Vercel Environment Variables Setup

Copy and paste these environment variables into your Vercel project settings:

## Required Environment Variables

### Database Configuration
```
DATABASE_URL=postgresql://postgres.ijwzuwhnropsrtfgmhgh:Chi3ft@n5527@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.ijwzuwhnropsrtfgmhgh:Chi3ft@n5527@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
```

### Email Service (Optional - for email notifications)
```
RESEND_API_KEY=your-resend-api-key-here
```

### External APIs (Optional - for weather data)
```
OPENWEATHER_API_KEY=your-openweather-api-key-here
```

## How to Add to Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Deploy your application

## Important Notes

- The DATABASE_URL uses pgbouncer for connection pooling (required for serverless)
- The DIRECT_URL is for Prisma migrations (not used in production)
- JWT_SECRET and NEXTAUTH_SECRET should be strong, random strings in production
- RESEND_API_KEY is optional but needed for email features
- OPENWEATHER_API_KEY is optional but provides real weather data

## Demo Accounts (work without database)

If database is not configured, these demo accounts will still work:

- **Free Tier**: demo@beachhui.com / demo123
- **Pro Tier**: pro@beachhui.com / pro123
- **Admin**: admin@beachhui.com / admin123