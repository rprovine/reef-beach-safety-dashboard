# 🏝️ Reef & Beach Safety Dashboard

Real-time beach safety monitoring and alert system for Hawaii's beaches. Aggregates data from NOAA, PacIOOS, and Hawaii DOH to provide current conditions, forecasts, and safety advisories.

## 🎯 Overview

A bootstrapped SaaS platform providing:
- **Public Access**: Real-time beach safety status (Safe/Caution/Unsafe)
- **Consumer Tier** ($4.99/mo): Custom alerts, 7-day forecasts, 30-day history
- **Business Tier** ($49/mo): Embeddable widgets, API access, branded reports
- **Enterprise** ($199/mo): Advanced API, multi-location, priority support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ with PostGIS
- Redis
- Stripe account
- Clerk account (for auth)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials

# Initialize database
psql -U postgres -f ../database/schema.sql

# Run migrations
alembic upgrade head

# Start API server
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`
API docs at `http://localhost:8000/api/docs`

## 🏗️ Architecture

### Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Leaflet/Mapbox for maps
- Chart.js/Recharts for visualizations
- Clerk for authentication
- Stripe for payments

**Backend**
- FastAPI (Python)
- PostgreSQL with PostGIS
- Redis for caching/queues
- SQLAlchemy ORM
- Arq for background jobs
- SendGrid (email) / Twilio (SMS)

**Infrastructure**
- Frontend: Vercel
- Backend: Render/Railway/Fly.io
- Database: Neon/Render PostgreSQL
- Redis: Upstash

## 📊 Data Sources

1. **NOAA/NWS**: Wave height, wind, tides
2. **PacIOOS**: Water temperature, currents
3. **Hawaii DOH**: Bacterial advisories, water quality

## 🎨 Features

### Beach Status Algorithm
- **🟢 Safe**: Waves ≤3ft, Wind ≤15mph, No advisories
- **🟡 Caution**: Waves 3-6ft OR Wind 16-25mph
- **🔴 Unsafe**: Waves >6ft OR Active advisory OR Storm warning
- **⚫ No Data**: No updates in 3+ hours

### Consumer Features
- Custom beach alerts (SMS/Email)
- 7-day forecasts
- 30-day historical charts
- Multiple beach monitoring
- Quiet hours for alerts

### Business Features
- Embeddable widgets (3 types)
- White-label branding
- Weekly PDF reports
- CSV data exports
- API access
- 5 team members

## 🗄️ Database Schema

Key tables:
- `beaches`: Beach locations and metadata
- `readings`: Time-series sensor data
- `advisories`: DOH/NWS warnings
- `beach_status`: Computed safety status
- `users` & `subscriptions`: User management
- `alerts` & `alert_rules`: Alert configuration
- `widgets`: Embeddable widget configs

## 🔌 API Endpoints

### Public
- `GET /api/v1/beaches?island={island}` - List beaches with status
- `GET /api/v1/beaches/{slug}` - Beach details
- `GET /api/v1/status/{slug}/history` - Historical data

### Authenticated
- `POST /api/v1/alerts` - Create alert
- `GET /api/v1/reports/weekly.pdf` - Generate report
- `GET /api/v1/widgets/{id}.js` - Widget embed code

## 📱 Widget Types

1. **Status Card**: Compact beach status display
2. **Mini Map**: Small interactive map
3. **Ticker Bar**: Rotating beach statuses

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=your_token
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost/reef_safety
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...
CLERK_SECRET_KEY=sk_test_...
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Railway/Render)
```bash
# Dockerfile included
docker build -t reef-safety-api .
docker push ...
```

### Database Migration
```bash
alembic upgrade head
```

## 📈 Monitoring

- Health check: `/health`
- Metrics: `/metrics` (Prometheus format)
- Structured logging with correlation IDs
- Sentry integration (optional)

## 💰 Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | Map view, basic beach info |
| **Consumer** | $4.99/mo | Alerts, forecasts, history |
| **Business** | $49/mo | Widgets, API, reports |
| **Enterprise** | $199/mo | Advanced API, SLA, custom |

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
pytest
pytest --cov=app tests/
```

## 📝 MVP Roadmap (30 Days)

**Week 1**: Database, API scaffolding, NOAA ingestion
**Week 2**: Beach detail, status computation, Stripe + Auth
**Week 3**: Alerts, SMS, charts, business widgets
**Week 4**: Testing, pricing page, onboarding, launch prep

## 🤝 Contributing

This is a bootstrapped project by LeniLani Consulting. For questions or contributions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🏄 Acknowledgments

- NOAA for marine data
- PacIOOS (UH Mānoa) for ocean observations
- Hawaii DOH Clean Water Branch for advisories

---

**Note**: This is an MVP product. Always follow official lifeguard guidance and posted signs at beaches. This system is for informational purposes only.