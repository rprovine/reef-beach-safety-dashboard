# 🌊 Reef & Beach Safety Dashboard

Real-time beach safety monitoring for Hawaii's beaches. Get instant alerts, forecasts, and conditions for 47+ beaches across Oʻahu, Maui, Kauaʻi, and the Big Island.

## 🏖️ Features

- **Real-Time Beach Conditions**: Live updates every 15 minutes from NOAA, PacIOOS, and Hawaii DOH
- **Interactive Map**: Visual beach safety status at a glance
- **Custom Alerts**: SMS and email notifications when conditions change
- **7-Day Forecasts**: Wave height, wind speed, and tide predictions
- **Business Widgets**: Embeddable widgets for hotels and tour operators
- **Multi-Tier SaaS**: Free, Consumer ($4.99/mo), Business ($49/mo), Enterprise ($199/mo)

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT + bcrypt
- **Payments**: HubSpot CRM Integration
- **Maps**: Leaflet + React Leaflet
- **Real-time Data**: React Query
- **AI**: OpenAI + Anthropic Claude APIs

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase account)
- HubSpot account for payments
- API keys for OpenAI and Anthropic (optional)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/rprovine/reef-beach-safety-dashboard.git
cd reef-beach-safety-dashboard/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-secret-key"
HUBSPOT_ACCESS_TOKEN="your-hubspot-token"
HUBSPOT_PORTAL_ID="your-portal-id"
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
```

4. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📊 Business Model

### Free Tier
- 3 beach alerts
- 7-day historical data
- Email notifications only

### Consumer ($4.99/month)
- 10 beach alerts
- 30-day historical data
- SMS + Email notifications
- 7-day forecasts

### Business ($49/month)
- Unlimited beaches
- 90-day historical data
- 3 embeddable widgets
- API access (10,000 calls/month)
- Priority support

### Enterprise ($199/month)
- Everything in Business
- Unlimited widgets
- Unlimited API calls
- 365-day historical data
- 14-day forecasts
- White-label options
- Dedicated support

## 🏗️ Project Structure

```
reef-beach-safety-dashboard/
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and services
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript definitions
│   ├── prisma/           # Database schema
│   └── public/           # Static assets
└── README.md
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-hosted
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📝 API Endpoints

- `GET /api/beaches` - List all beaches with current conditions
- `GET /api/beaches/[slug]` - Get detailed beach information
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/payment/checkout` - Create HubSpot payment session
- `GET /api/alerts` - User's configured alerts
- `POST /api/alerts` - Create new alert

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Beach data from NOAA, PacIOOS, and Hawaii Department of Health
- Ocean videos and images from Pexels
- Built with ❤️ in Hawaii

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Live Demo**: Coming soon!

**Documentation**: [View Docs](https://github.com/rprovine/reef-beach-safety-dashboard/wiki)