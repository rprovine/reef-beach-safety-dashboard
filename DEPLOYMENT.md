# Deployment Guide - Beach Hui

**Version**: 1.0  
**Last Updated**: January 2025  
**Platform**: Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rprovine/reef-beach-safety-dashboard)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- OpenWeather API key
- GitHub account
- Vercel account (free tier works)

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Weather API (Required)
OPENWEATHER_API_KEY="your_openweather_api_key"

# App Configuration
NEXT_PUBLIC_APP_NAME="Beach Hui"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### Optional Variables

```env
# Additional APIs
NOAA_API_KEY="your_noaa_api_key"
STORMGLASS_API_KEY="your_stormglass_api_key"

# Email (for notifications)
SENDGRID_API_KEY="your_sendgrid_api_key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"

# Authentication
JWT_SECRET="random_32_character_string"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="another_random_string"
```

## Deployment Steps

### 1. Database Setup (Supabase)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the database URL from Settings > Database
4. Update your `.env.local`:
   ```env
   DATABASE_URL="your_supabase_connection_string"
   ```

### 2. Run Database Migrations

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with initial data
npm run db:seed
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Click "Deploy"

### 4. Configure Environment Variables in Vercel

1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add all required variables:
   - `DATABASE_URL`
   - `OPENWEATHER_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL)

### 5. Configure Domain (Optional)

1. Go to Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatic

## Production Checklist

### Security
- [ ] All API keys in environment variables
- [ ] Database connection uses SSL
- [ ] Rate limiting configured
- [ ] CORS settings updated for production domain
- [ ] Security headers enabled

### Performance
- [ ] Image optimization enabled
- [ ] Caching headers configured
- [ ] Database indexes created
- [ ] API response caching

### Monitoring
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Analytics (Google Analytics/Plausible)
- [ ] Uptime monitoring
- [ ] Performance monitoring

## Build Configuration

### next.config.js

```javascript
module.exports = {
  images: {
    domains: ['openweathermap.org'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

## Database Management

### Backup Strategy

```bash
# Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Monitoring & Logs

### Vercel Logs

Access logs from Vercel dashboard or CLI:

```bash
# View function logs
vercel logs

# View build logs
vercel logs --build

# Stream logs
vercel logs --follow
```

### Application Monitoring

Recommended services:
- **Error Tracking**: Sentry
- **Analytics**: Plausible, Google Analytics
- **Uptime**: Better Uptime, Pingdom
- **Performance**: Vercel Analytics

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

```
Error: Can't reach database server
```

**Solution**: 
- Check DATABASE_URL format
- Ensure SSL is enabled: `?sslmode=require`
- Verify database is accessible

#### 2. API Key Issues

```
Warning: OpenWeather API key not configured
```

**Solution**:
- Add OPENWEATHER_API_KEY to Vercel environment variables
- Redeploy after adding variables

#### 3. Build Failures

```
Error: Module not found
```

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### 4. CORS Errors

**Solution**: Update allowed origins in middleware:
```typescript
const allowedOrigins = [
  'https://your-domain.vercel.app',
  'https://your-custom-domain.com'
]
```

## Performance Optimization

### Caching Strategy

```typescript
// API route caching
export const revalidate = 60 // Cache for 60 seconds

// Static generation
export const dynamic = 'force-static'
```

### Image Optimization

```jsx
import Image from 'next/image'

<Image
  src="/beach.jpg"
  alt="Beach"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_beaches_island ON beaches(island);
CREATE INDEX idx_beaches_status ON beaches(status);
CREATE INDEX idx_readings_timestamp ON beach_readings(timestamp);
```

## Scaling

### Vercel Limits (Free Tier)

- **Serverless Functions**: 10 second timeout
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6,000/month
- **Concurrent Builds**: 1

### Upgrade Considerations

Consider upgrading when:
- Traffic exceeds 100k visits/month
- Need longer function timeouts
- Require team collaboration
- Need custom domains (>1)

## Rollback Procedure

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback

# Or promote specific deployment
vercel promote [deployment-url]
```

## Support

- **Documentation**: [GitHub Wiki](https://github.com/rprovine/reef-beach-safety-dashboard/wiki)
- **Issues**: [GitHub Issues](https://github.com/rprovine/reef-beach-safety-dashboard/issues)
- **Email**: info@lenilani.com
- **Website**: [lenilani.com](https://lenilani.com)

---

**© 2025 LeniLani Consulting - Beach Hui Platform**