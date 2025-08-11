# 🧪 Testing Guide for Reef & Beach Safety Dashboard

## Quick Start Testing

### 1. **View the Application**
```bash
# Make sure dev server is running
npm run dev

# Open in browser
open http://localhost:3000
```

### 2. **Test with cURL Commands**

#### A. Register a New User (Free Tier)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "name": "Test User",
    "phone": "808-555-0100"
  }'
```

**Expected Response:**
- ✅ 200 OK with token and user data
- User gets 14-day trial
- Default tier: "free"

#### B. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
- ✅ 200 OK with token
- Save the token for authenticated requests

#### C. Get User's Alerts (Authenticated)
```bash
# Replace YOUR_TOKEN with the token from login
curl -X GET http://localhost:3000/api/alerts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
- ✅ 200 OK with alerts array (empty initially)
- Shows tier features (smsEnabled: false for free tier)

#### D. Try to Create Alert with SMS (Should Fail for Free Tier)
```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Surf Alert",
    "beachId": "test-beach-1",
    "metric": "wave_height_ft",
    "operator": "gt",
    "threshold": 6,
    "channels": ["sms"],
    "isActive": true
  }'
```

**Expected Response:**
- ❌ 403 Forbidden - "SMS notifications require Consumer tier or higher"

#### E. Try Public API (Should Fail for Free Tier)
```bash
curl -X GET http://localhost:3000/api/v1/beaches \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
- ❌ 403 Forbidden - "Feature not available" (API access requires Business tier)

### 3. **Test Tier Limits**

| Feature | Free | Consumer ($4.99) | Business ($49) | Enterprise ($199) |
|---------|------|------------------|----------------|-------------------|
| Beach Alerts | 3 | 10 | Unlimited | Unlimited |
| SMS Notifications | ❌ | ✅ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| Historical Data | 7 days | 30 days | 90 days | 365 days |
| Forecast | 3 days | 7 days | 7 days | 14 days |
| Widgets | 0 | 0 | 3 | Unlimited |

### 4. **Test Payment Integration**

```bash
# Create checkout session for upgrade
curl -X POST http://localhost:3000/api/payment/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "consumer",
    "billingCycle": "monthly"
  }'
```

**Expected Response:**
- Should create HubSpot payment session
- Returns payment URL

### 5. **Database Setup Issues**

If you're getting database errors:

1. **Option A: Use Separate Schema** (Recommended)
   ```sql
   -- Connect to Supabase and run:
   CREATE SCHEMA reef;
   ```
   
   Then update `.env`:
   ```
   DATABASE_URL="postgresql://...?schema=reef"
   ```

2. **Option B: Reset Database** (⚠️ Will delete tourism bot data)
   ```bash
   npx prisma db push --force-reset
   ```

3. **Option C: Use Different Database**
   - Create new Supabase project
   - Update DATABASE_URL in .env

### 6. **Seed Test Data**

Create a seed script:

```bash
# Create seed file
cat > prisma/seed.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create test beaches
  const beaches = [
    { name: 'Waikiki Beach', slug: 'waikiki', island: 'oahu', lat: 21.2761, lng: -157.8267 },
    { name: 'Lanikai Beach', slug: 'lanikai', island: 'oahu', lat: 21.3929, lng: -157.7156 },
    { name: 'Pipeline', slug: 'pipeline', island: 'oahu', lat: 21.6650, lng: -158.0533 },
  ];
  
  for (const beach of beaches) {
    await prisma.beach.upsert({
      where: { slug: beach.slug },
      update: {},
      create: {
        ...beach,
        spotType: 'general',
        description: `${beach.name} is a popular beach on ${beach.island}`,
        amenities: ['parking', 'restrooms', 'showers'],
        isActive: true
      }
    });
  }
  
  console.log('✅ Seeded beaches');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# Run seed
node prisma/seed.js
```

### 7. **Browser Testing**

1. **Homepage**: http://localhost:3000
   - Should see hero section with ocean video
   - Beach safety tiers displayed
   - Navigation to beaches page

2. **Beaches Page**: http://localhost:3000/beaches
   - Interactive map with beach markers
   - Beach cards with status indicators
   - Search and filter functionality

3. **Beach Detail**: http://localhost:3000/beaches/[slug]
   - Individual beach information
   - Current conditions (once data is seeded)
   - Alert setup button (requires login)

### 8. **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| "Can't reach database server" | Check DATABASE_URL in .env, ensure Supabase is accessible |
| "Module not found" | Run `npm install` |
| "Token expired" | Login again to get fresh token |
| "Beach not found" | Run seed script to add test beaches |
| "Invalid tier" | Check user tier in database |

### 9. **Test Different Scenarios**

1. **Free Tier Limitations**
   - ✅ Can create email alerts (up to 3)
   - ❌ Cannot use SMS
   - ❌ Cannot access API
   - ✅ Can view 7 days history

2. **Consumer Tier ($4.99)**
   - ✅ Can create 10 alerts
   - ✅ Can use SMS
   - ❌ Cannot access API
   - ✅ Can view 30 days history

3. **Business Tier ($49)**
   - ✅ Unlimited beaches
   - ✅ API access (10k requests/day)
   - ✅ 3 embeddable widgets
   - ✅ 90 days history

4. **Enterprise Tier ($199)**
   - ✅ Everything unlimited
   - ✅ 365 days history
   - ✅ 14-day forecasts
   - ✅ White-label options

### 10. **Monitoring & Logs**

Check server logs:
```bash
# In the terminal running npm run dev
# Look for console.log outputs from API routes
```

Check Prisma queries:
```bash
# Set in .env for detailed logs
DATABASE_URL="...?connection_limit=1&pool_timeout=20"
PRISMA_LOG="query,error,warn"
```

## Next Steps

1. **Build Alert UI**: Create frontend components for alert management
2. **Add Beach Data**: Integrate with NOAA/PacIOOS APIs
3. **Setup Webhooks**: Configure HubSpot webhooks for payment updates
4. **Add Tests**: Create Jest/Vitest test suite
5. **Deploy**: Push to Vercel with environment variables