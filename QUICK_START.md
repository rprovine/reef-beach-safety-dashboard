# 🚀 Quick Start Guide - Reef & Beach Safety Dashboard

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed
- [ ] PostgreSQL 15+ installed
- [ ] Redis installed (or use Docker)
- [ ] Git installed

## Step 1: Clone or Navigate to Project

```bash
cd /Users/renoprovine/Development/reef-beach-safety-dashboard
```

## Step 2: Database Setup

```bash
# Start PostgreSQL if not running
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql  # Linux

# Create database and user
createdb reef_safety
psql -d reef_safety -c "CREATE USER reef_user WITH PASSWORD 'your_password';"
psql -d reef_safety -c "GRANT ALL PRIVILEGES ON DATABASE reef_safety TO reef_user;"

# Install PostGIS extension
psql -d reef_safety -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Run schema
psql -d reef_safety -f database/schema.sql
```

## Step 3: Redis Setup

```bash
# Option 1: Local Redis
brew install redis  # macOS
brew services start redis

# Option 2: Docker Redis
docker run -d -p 6379:6379 --name reef-redis redis:alpine
```

## Step 4: Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

### Required .env changes:
```env
SECRET_KEY=generate-a-random-32-character-string-here
DATABASE_URL=postgresql://reef_user:your_password@localhost:5432/reef_safety
REDIS_URL=redis://localhost:6379

# Add your API keys when you have them:
STRIPE_SECRET_KEY=sk_test_...
CLERK_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...
```

```bash
# Run the backend
uvicorn main:app --reload --port 8000

# Backend will be available at http://localhost:8000
# API docs at http://localhost:8000/api/docs
```

## Step 5: Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your settings
nano .env.local  # or use your preferred editor
```

### Required .env.local changes:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000

# Add these when you have accounts:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_MAPBOX_TOKEN=pk_...
```

```bash
# Run the frontend
npm run dev

# Frontend will be available at http://localhost:3000
```

## Step 6: Verify Everything Works

1. **Check Backend**: Go to http://localhost:8000/health
   - Should return: `{"status":"healthy","version":"1.0.0","environment":"development"}`

2. **Check API Docs**: Go to http://localhost:8000/api/docs
   - Should show FastAPI interactive documentation

3. **Check Frontend**: Go to http://localhost:3000
   - Should show the beach safety dashboard homepage

## Quick Service Setup

### Get a Mapbox Token (Free)
1. Go to https://account.mapbox.com/auth/signup/
2. Create free account
3. Copy your default public token
4. Add to `frontend/.env.local` as `NEXT_PUBLIC_MAPBOX_TOKEN`

### Get Clerk Auth (Free tier)
1. Go to https://clerk.com/
2. Sign up for free account
3. Create an application
4. Copy keys to both `.env` files

### Get Stripe Test Keys
1. Go to https://dashboard.stripe.com/register
2. Sign up for account
3. Get test mode API keys
4. Add to both `.env` files

## Development Commands

### Backend Commands
```bash
cd backend

# Run tests
pytest

# Format code
black .

# Type checking
mypy app

# Database migrations (if using Alembic)
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Frontend Commands
```bash
cd frontend

# Type checking
npm run type-check

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Sample Data

To add sample beach data:

```sql
-- Connect to database
psql -d reef_safety

-- Check beaches
SELECT id, name, slug, island_id FROM beaches;

-- Add a test reading
INSERT INTO readings (beach_id, ts, wave_height_ft, wind_mph, source)
VALUES (1, NOW(), 2.5, 10, 'manual');

-- Add a test advisory
INSERT INTO advisories (beach_id, source, status, title, started_at)
VALUES (1, 'manual', 'active', 'High Bacteria Levels', NOW());
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>

# Find process using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check connection string
psql postgresql://reef_user:your_password@localhost:5432/reef_safety
```

### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Module Import Errors
```bash
# Make sure virtual environment is activated
which python
# Should show: .../venv/bin/python

# Reinstall dependencies
pip install -r requirements.txt --upgrade
```

## Next Steps

1. ✅ Verify basic setup works
2. 🔧 Configure external services (Mapbox, Clerk, Stripe)
3. 📊 Implement data ingestion from NOAA
4. 🗺️ Build out the map interface
5. 🔔 Set up the alert system
6. 💳 Implement payment flow
7. 📱 Create embeddable widgets
8. 🚀 Deploy to production

## Support

For issues or questions about this project:
- Check the README.md for detailed documentation
- Review PROJECT_SUMMARY.md for architecture decisions
- Consult the API docs at http://localhost:8000/api/docs

---

**Ready to build! 🏄‍♂️**