# 🌊 Reef & Beach Safety Dashboard

**The most comprehensive beach safety platform for Hawaii**

Making every beach day a safe beach day through real-time data, community intelligence, and family-focused features.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-green)](http://localhost:3001)
[![Beaches](https://img.shields.io/badge/Beaches-70%20Hawaiian-blue)](http://localhost:3001/beaches)
[![Data Sources](https://img.shields.io/badge/Data%20Sources-5%20Active-orange)](#data-sources)

## 🏆 Why We're Better Than Surfline

| Feature | Reef & Beach Safety | Surfline |
|---------|-------------------|----------|
| **Beach Coverage** | 70 Hawaiian beaches | ~20 beaches |
| **Safety Focus** | ✅ Bacteria, UV, currents, hazards | ❌ Waves only |
| **Family Features** | ✅ Kid ratings, amenities, accessibility | ❌ Surfer-focused |
| **Community Reports** | ✅ Real-time hazard updates | ❌ Limited |
| **Free Tier** | ✅ Essential safety always free | ❌ Subscription required |
| **Multi-Activity** | ✅ Swimming, diving, snorkeling, fishing | ❌ Surfing only |

## ✨ Features

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
- **Community reports**: Real-time updates from beachgoers
- **Personalized alerts**: Custom notifications for favorite beaches
- **Activity ratings**: Best conditions for swimming, diving, fishing
- **Local insights**: Tips from Hawaii residents

## 🗺️ Beach Coverage

### 🏖️ **70 Beaches Across 6 Islands**
- **Oahu**: 15 beaches (Waikiki, Pipeline, Lanikai, Hanauma Bay...)
- **Maui**: 15 beaches (Big Beach, Napili Bay, Hookipa...)
- **Kauai**: 15 beaches (Poipu, Hanalei Bay, Tunnels...)
- **Big Island**: 15 beaches (Hapuna, Green Sand, Punaluu...)
- **Molokai**: 5 beaches (Papohaku, Murphy Beach...)
- **Lanai**: 5 beaches (Hulopoe, Shipwreck Beach...)

## 🔌 Data Sources

### **Active APIs**
- **StormGlass** 🌊 - Professional marine weather data
- **NOAA** 🌡️ - Tide predictions and buoy readings  
- **Hawaii DOH** 💧 - Water quality and bacteria levels
- **Community** 👥 - Real-time user reports and photos

### **Planned Integrations**
- **OpenWeatherMap** ☀️ - UV index and atmospheric data
- **PacIOOS** 🏄 - Hawaii-specific ocean models
- **Instagram API** 📸 - Recent beach photos
- **IoT Sensors** 📡 - Custom monitoring devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase)
- API keys for external services

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/reef-beach-safety-dashboard
cd reef-beach-safety-dashboard/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Set up the database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

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

# Get community reports
GET /api/community/reports?beachId={id}
```

### **Protected Endpoints**
```bash
# User authentication
POST /api/auth/login
POST /api/auth/register

# Alert management
GET /api/alerts
POST /api/alerts

# User dashboard
GET /api/dashboard
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

## 📞 Support

- **Documentation**: [docs.reefbeachsafety.com](http://localhost:3001/docs)
- **Email**: support@reefbeachsafety.com
- **GitHub Issues**: [Report bugs here](https://github.com/yourusername/reef-beach-safety-dashboard/issues)
- **Community**: [Join our Discord](https://discord.gg/reefbeachsafety)

---

**Built with 🌊 in Hawaii for safer beach experiences worldwide.**