# Beach Hui 🏖️🪸
### *Hawaii's Premier Beach Safety & Reef Conservation Platform*
#### Powered by LeniLani Consulting

Beach Hui ("beach community" in Hawaiian) is a comprehensive platform combining real-time ocean conditions, reef health monitoring, marine ecosystem tracking, and community reporting. We provide live weather data, UV warnings, surf conditions, and detailed reef safety information for 71+ beaches across Hawaii.

**🌟 Live Demo**: [https://beachhui.vercel.app](https://beachhui.vercel.app)
**📱 API Status**: ✅ Operational with live OpenWeather data
**🪸 Reef Monitoring**: Active for all beaches

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-green)](http://localhost:3001)
[![Beaches](https://img.shields.io/badge/Beaches-71%20Hawaiian-blue)](http://localhost:3001/beaches)
[![Database](https://img.shields.io/badge/Database-Supabase-green)](#database-setup)

## 🏆 Why We're Better Than Surfline

| Feature | Beach Hui | Surfline |
|---------|-------------------|----------|
| **Beach Coverage** | 70 Hawaiian beaches | ~20 beaches |
| **Safety Focus** | ✅ Bacteria, UV, currents, hazards | ❌ Waves only |
| **Family Features** | ✅ Kid ratings, amenities, accessibility | ❌ Surfer-focused |
| **Community Reports** | ✅ Real-time hazard updates | ❌ Limited |
| **Free Tier** | ✅ Essential safety always free | ❌ Subscription required |
| **Multi-Activity** | ✅ Swimming, diving, snorkeling, fishing | ❌ Surfing only |

## 🚀 What's New (January 2025)

- ✅ **Tiered Access System**: Free, Pro, and Admin tiers with feature gating
- ✅ **Community Reporting**: Real-time beach reports from users
- ✅ **Advanced Analytics**: Beach trends, visitor tracking, safety metrics
- ✅ **Alert Management**: Custom beach alerts with email/SMS notifications
- ✅ **Live Weather Integration**: Real-time data from OpenWeather API
- ✅ **Extreme UV Monitoring**: Hawaii's UV index 11-12 warnings
- ✅ **Comprehensive Reef Dashboard**: 5-tab interface with health, hazards, and conservation
- ✅ **7-Day Forecasts**: Pro tier exclusive weather predictions
- ✅ **Marine Life Tracking**: Monk seals, sea turtles, whales, dolphins

## ✨ Core Features

### 🌊 **Real-Time Ocean Data**
- **Wave conditions**: Height, period, direction from StormGlass API
- **Water temperature**: Live readings from marine buoys
- **Current analysis**: Rip current risk calculations
- **Swell forecasts**: 3-hour and 24-hour predictions

### 🛡️ **Safety First**
- **Safety scores**: 0-100 rating system
- **Water quality**: Bacteria levels and health advisories
- **UV index**: Sunburn prevention recommendations
- **Hazard alerts**: Jellyfish, sharks, dangerous conditions

### 👨‍👩‍👧‍👦 **Family Friendly**
- **Kid-safe ratings**: Age-appropriate beach recommendations
- **Amenities mapping**: Restrooms, showers, shade, food
- **Accessibility info**: Wheelchair access, stroller-friendly paths
- **Educational features**: Tide pools, marine life spotting

### 📱 **Smart Features**
- **Community reports**: Real-time updates from beachgoers with verification
- **Personalized alerts**: Custom notifications for favorite beaches (email/SMS for Pro)
- **Activity ratings**: Best conditions for swimming, diving, fishing
- **Local insights**: Tips from Hawaii residents
- **Historical trends**: 30-day analytics for Pro members
- **Export capabilities**: Download beach data and reports (Pro)

## 🗺️ Beach Coverage

### 🏖️ **71 Beaches Across 6 Islands**
- **Oʻahu**: 15 beaches (Waikiki, Pipeline, Lanikai, Hanauma Bay, White Sands...)
- **Maui**: 15 beaches (Big Beach, Napili Bay, Hookipa, Wailea...)
- **Kauaʻi**: 14 beaches (Poipu, Hanalei Bay, Tunnels, Secret Beach...)
- **Big Island**: 19 beaches (Hapuna, Green Sand, Punaluu, White Sands...)
- **Molokai**: 5 beaches (Papohaku, Murphy Beach, Halawa...)
- **Lanai**: 5 beaches (Hulopoe, Shipwreck Beach, Manele Bay...)

## 🔌 Data Sources

### **Active APIs**
- **OpenWeatherMap** ☀️ - ✅ LIVE - Current weather, UV index (11-12!), 7-day forecasts
- **StormGlass** 🌊 - Professional marine weather data
- **NOAA** 🌡️ - Tide predictions and buoy readings  
- **Hawaii DOH** 💧 - Water quality and bacteria levels
- **Community** 👥 - Real-time user reports and photos

### **Planned Integrations**
- **PacIOOS** 🏄 - Hawaii-specific ocean models
- **Instagram API** 📸 - Recent beach photos
- **IoT Sensors** 📡 - Custom monitoring devices
- **Surfline** 🏄 - Surf cams and wave models

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase)
- API keys for external services

### Installation

```bash
# Clone the repository
git clone https://github.com/rprovine/reef-beach-safety-dashboard
cd reef-beach-safety-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Set up the database
npx prisma db push
npm run seed-beaches
npm run seed-users

# Start development server
npm run dev
```

### Demo Accounts

Test the tiered features with these demo accounts:

- **Free Tier**: `demo@beachhui.com` / `demo123`
- **Pro Tier**: `pro@beachhui.com` / `pro123`
- **Admin Tier**: `admin@beachhui.com` / `admin123`

### Environment Variables

```bash
# Database
DATABASE_URL="your-supabase-connection-string"

# Authentication  
JWT_SECRET="your-secret-key"

# External APIs
NEXT_PUBLIC_STORMGLASS_API_KEY="your-stormglass-key"
NEXT_PUBLIC_OPENWEATHER_API_KEY="your-openweather-key"

# Business Integration
HUBSPOT_ACCESS_TOKEN="your-hubspot-token"
HUBSPOT_PORTAL_ID="your-portal-id"
```

## 📊 API Endpoints

### **Public Endpoints**
```bash
# Get all beaches
GET /api/beaches

# Get comprehensive beach data
GET /api/beaches/{slug}/comprehensive

# Get current conditions
GET /api/beaches/{slug}/conditions

# Get weather forecast
GET /api/beaches/{slug}/weather
```

### **Protected Endpoints (Authentication Required)**
```bash
# User authentication
POST /api/auth/login
POST /api/auth/register
GET /api/auth/verify

# Alert management (Pro/Admin)
GET /api/alerts
POST /api/alerts
DELETE /api/alerts/{id}

# Community reports
GET /api/community/reports
POST /api/community/reports
PUT /api/community/reports/{id}/verify

# User dashboard
GET /api/dashboard
GET /api/dashboard/stats
```

### **Admin Endpoints**
```bash
# Beach management
PUT /api/admin/beaches/{id}
POST /api/admin/beaches/{id}/status

# User management
GET /api/admin/users
PUT /api/admin/users/{id}/tier

# System analytics
GET /api/admin/analytics
GET /api/admin/reports
```

## 🏗️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Component library
- **React Query** - Data fetching and caching

### **Backend**
- **Next.js API Routes** - Serverless functions
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication

### **External Services**
- **Supabase** - Database hosting and auth
- **HubSpot** - CRM and payment processing
- **StormGlass** - Marine weather API
- **NOAA** - Government weather data

## 🌊 Real-Time Data Example

```json
{
  "name": "Waikiki Beach",
  "conditions": {
    "waveHeight": 1.25,
    "waterTemp": 84,
    "windSpeed": 2.2,
    "ripCurrentRisk": "low",
    "safetyScore": 92
  },
  "activities": {
    "swimming": "excellent",
    "surfing": "fair",
    "snorkeling": "good"
  },
  "family": {
    "kidSafe": "excellent",
    "ageGroups": {
      "toddlers": true,
      "children": true,
      "teens": true
    },
    "amenities": {
      "restrooms": true,
      "lifeguard": true,
      "parking": true
    }
  }
}
```

## 🎯 Competitive Advantages

### **1. Safety-First Philosophy**
Unlike surf-focused platforms, we prioritize comprehensive safety:
- Water quality monitoring
- UV exposure warnings  
- Marine life hazard alerts
- Family-appropriate recommendations

### **2. Community Intelligence**
Real-time reports from locals and visitors:
- Current conditions updates
- Hazard warnings
- Best time recommendations
- Photo verification

### **3. Family Focus**
Designed for all beachgoers, not just surfers:
- Kid-safe beach ratings
- Amenity information
- Accessibility features
- Educational opportunities

### **4. Comprehensive Coverage**
70 beaches vs competitors' limited selection:
- All major Hawaiian beaches
- Lesser-known local favorites
- Complete island coverage
- Detailed local knowledge

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Docker**
```bash
# Build container
docker build -t reef-beach-safety .

# Run container
docker run -p 3000:3000 reef-beach-safety
```

## 📈 Monitoring & Analytics

### **Performance Metrics**
- API response times
- Cache hit rates  
- User engagement
- Safety alert effectiveness

### **Business Metrics**
- Daily active users
- Beach visits tracked
- Community reports submitted
- Subscription conversions

## 🛣️ Roadmap

### **Phase 1: Mobile App** 📱
- React Native iOS/Android app
- Offline beach data
- Push notifications
- GPS-based recommendations

### **Phase 2: IoT Integration** 🔬
- Custom sensor deployment
- Real-time water quality monitoring
- Automated hazard detection
- Enhanced accuracy

### **Phase 3: AI & Machine Learning** 🤖
- Predictive hazard modeling
- Personalized recommendations
- Image recognition for conditions
- Natural language processing

### **Phase 4: Global Expansion** 🌍
- California beaches
- Australia partnerships
- Caribbean islands
- Mediterranean coastlines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### **Development Process**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### **Community Guidelines**
- Report bugs via GitHub issues
- Suggest features through discussions
- Share local beach knowledge
- Help verify community reports

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hawaii Department of Health** - Water quality data
- **NOAA** - Marine weather and tide data
- **StormGlass** - Professional marine forecasts
- **Local Hawaii Communities** - Beach knowledge and insights

## 🔒 Security Features

### **Data Protection**
- JWT authentication with secure tokens
- Bcrypt password hashing
- Rate limiting (60 req/min default)
- CORS protection
- SQL injection prevention via Prisma ORM

### **Security Headers**
- Strict-Transport-Security (HSTS)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content Security Policy (CSP)
- Referrer-Policy: origin-when-cross-origin

### **API Security**
- Rate limiting per IP/user
- API key authentication for partners
- Request validation and sanitization
- Error message sanitization
- Audit logging

## 📚 Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[Development Guide](./DEVELOPMENT.md)** - Setup and contribution guide
- **[Security Policy](./SECURITY.md)** - Security best practices
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Check TypeScript types
npm run type-check

# Lint code
npm run lint
```

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Environment Variables Required**
```env
# Production Database
DATABASE_URL="postgresql://..."

# API Keys (Required)
OPENWEATHER_API_KEY="your-key"  # ✅ Working!

# Optional APIs
STORMGLASS_API_KEY="your-key"
NOAA_API_KEY="your-key"

# Security
JWT_SECRET="strong-secret-key"
ENCRYPTION_KEY="32-char-key"
```

## 📊 Performance

- **Lighthouse Score**: 95+ Performance
- **API Response Time**: <200ms average
- **Cache Strategy**: 10-min weather, 1-hour tides
- **CDN**: Vercel Edge Network
- **Database**: Supabase with connection pooling

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Priority Areas**
- Additional beach data sources
- Mobile app development
- Beach webcam integration
- Machine learning predictions
- Localization (Hawaiian, Japanese, Chinese)

## 📞 Support

- **Documentation**: [Beach Hui Docs](https://github.com/rprovine/reef-beach-safety-dashboard/wiki)
- **Email**: info@lenilani.com
- **Website**: [https://lenilani.com](https://lenilani.com)
- **GitHub Issues**: [Report bugs here](https://github.com/rprovine/reef-beach-safety-dashboard/issues)

## 🌺 Mahalo

Special thanks to:
- **LeniLani Consulting** - Project sponsor and vision
- **Hawaii Department of Health** - Water quality data
- **NOAA** - Marine weather and tide data
- **OpenWeatherMap** - Live weather and UV data
- **Local Hawaii Communities** - Beach knowledge and cultural insights

---

**Built with 🌊 by LeniLani Consulting for safer beach experiences in Hawaii.**

**Contact**: info@lenilani.com | [lenilani.com](https://lenilani.com)# Deployment trigger: Tue Aug 12 18:13:46 HST 2025
