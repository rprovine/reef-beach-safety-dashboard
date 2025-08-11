-- Reef & Beach Safety Dashboard Database Schema
-- PostgreSQL 15+
-- Extensions required: postgis, pg_cron

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Islands table
CREATE TABLE islands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  center_lat DOUBLE PRECISION NOT NULL,
  center_lng DOUBLE PRECISION NOT NULL,
  zoom_level INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beaches table with geospatial data
CREATE TABLE beaches (
  id SERIAL PRIMARY KEY,
  island_id INT REFERENCES islands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  spot_type TEXT DEFAULT 'general' CHECK (spot_type IN ('general', 'surf', 'family', 'tidepool')),
  noaa_station_id TEXT,
  pacioos_station_id TEXT,
  doh_location_id TEXT,
  wave_threshold_safe NUMERIC(4,1) DEFAULT 3.0,
  wave_threshold_caution NUMERIC(4,1) DEFAULT 6.0,
  wind_threshold_safe NUMERIC(4,1) DEFAULT 15.0,
  wind_threshold_caution NUMERIC(4,1) DEFAULT 25.0,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for beaches
CREATE INDEX beaches_island_idx ON beaches(island_id);
CREATE INDEX beaches_location_idx ON beaches USING GIST(location);
CREATE INDEX beaches_slug_idx ON beaches(slug);
CREATE INDEX beaches_active_idx ON beaches(is_active) WHERE is_active = TRUE;

-- Readings table for time-series data
CREATE TABLE readings (
  id BIGSERIAL PRIMARY KEY,
  beach_id INT REFERENCES beaches(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ NOT NULL,
  wave_height_ft NUMERIC(4,1),
  wave_period_sec NUMERIC(4,1),
  wind_mph NUMERIC(4,1),
  wind_dir_deg NUMERIC(5,1),
  water_temp_f NUMERIC(4,1),
  tide_ft NUMERIC(5,2),
  source TEXT NOT NULL CHECK (source IN ('noaa', 'pacioos', 'calc', 'manual')),
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hypertable for time-series optimization (if using TimescaleDB)
-- SELECT create_hypertable('readings', 'ts', chunk_time_interval => INTERVAL '1 day');

-- Indexes for readings
CREATE INDEX readings_beach_ts_idx ON readings(beach_id, ts DESC);
CREATE INDEX readings_ts_idx ON readings(ts DESC);

-- Advisories table
CREATE TABLE advisories (
  id BIGSERIAL PRIMARY KEY,
  beach_id INT REFERENCES beaches(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('doh', 'nws', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved')),
  severity TEXT DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'danger')),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for advisories
CREATE INDEX advisories_beach_status_idx ON advisories(beach_id, status);
CREATE INDEX advisories_started_idx ON advisories(started_at DESC);
CREATE INDEX advisories_active_idx ON advisories(beach_id) WHERE status = 'active';

-- Beach status snapshots (computed)
CREATE TABLE beach_status (
  id BIGSERIAL PRIMARY KEY,
  beach_id INT REFERENCES beaches(id) ON DELETE CASCADE,
  ts TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('green', 'yellow', 'red', 'gray')),
  wave_height_ft NUMERIC(4,1),
  wind_mph NUMERIC(4,1),
  has_advisory BOOLEAN DEFAULT FALSE,
  reason JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (beach_id, ts)
);

-- Indexes for beach_status
CREATE INDEX beach_status_beach_ts_idx ON beach_status(beach_id, ts DESC);
CREATE INDEX beach_status_ts_idx ON beach_status(ts DESC);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'consumer', 'business', 'enterprise', 'admin')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for users
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_clerk_idx ON users(clerk_id) WHERE clerk_id IS NOT NULL;

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('consumer', 'business', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  canceled_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Indexes for subscriptions
CREATE INDEX subscriptions_user_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_stripe_sub_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX subscriptions_status_idx ON subscriptions(status) WHERE status = 'active';

-- Alerts configuration
CREATE TABLE alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  channels TEXT[] NOT NULL DEFAULT '{email}',
  quiet_hours JSONB,
  frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'hourly', 'daily')),
  last_triggered_at TIMESTAMPTZ,
  trigger_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for alerts
CREATE INDEX alerts_user_idx ON alerts(user_id);
CREATE INDEX alerts_active_idx ON alerts(user_id, is_active) WHERE is_active = TRUE;

-- Alert rules
CREATE TABLE alert_rules (
  id BIGSERIAL PRIMARY KEY,
  alert_id BIGINT REFERENCES alerts(id) ON DELETE CASCADE,
  beach_id INT REFERENCES beaches(id) ON DELETE CASCADE,
  metric TEXT NOT NULL CHECK (metric IN ('wave_height_ft', 'wind_mph', 'advisory', 'status_change')),
  operator TEXT NOT NULL CHECK (operator IN ('gt', 'gte', 'lt', 'lte', 'eq', 'ne', 'changed', 'is_active')),
  threshold NUMERIC(6,2),
  UNIQUE(alert_id, beach_id, metric, operator)
);

-- Indexes for alert_rules
CREATE INDEX alert_rules_alert_idx ON alert_rules(alert_id);
CREATE INDEX alert_rules_beach_idx ON alert_rules(beach_id);

-- Notifications log
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  alert_id BIGINT REFERENCES alerts(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  beach_id INT REFERENCES beaches(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  subject TEXT,
  body TEXT,
  metadata JSONB,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX notifications_user_idx ON notifications(user_id, created_at DESC);
CREATE INDEX notifications_alert_idx ON notifications(alert_id);
CREATE INDEX notifications_status_idx ON notifications(status) WHERE status = 'pending';

-- API keys for business users
CREATE TABLE api_keys (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'read:public' CHECK (scope IN ('read:public', 'read:business', 'write:business')),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for api_keys
CREATE INDEX api_keys_user_idx ON api_keys(user_id);
CREATE INDEX api_keys_hash_idx ON api_keys(key_hash);
CREATE INDEX api_keys_active_idx ON api_keys(key_hash, is_active) WHERE is_active = TRUE;

-- Widgets configuration
CREATE TABLE widgets (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  embed_token TEXT NOT NULL UNIQUE,
  domain_whitelist TEXT[],
  view_count INT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for widgets
CREATE INDEX widgets_user_idx ON widgets(user_id);
CREATE INDEX widgets_token_idx ON widgets(embed_token);
CREATE INDEX widgets_active_idx ON widgets(embed_token, is_active) WHERE is_active = TRUE;

-- Analytics events
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  beach_id INT REFERENCES beaches(id) ON DELETE SET NULL,
  widget_id BIGINT REFERENCES widgets(id) ON DELETE SET NULL,
  properties JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX analytics_events_type_idx ON analytics_events(event_type, created_at DESC);
CREATE INDEX analytics_events_user_idx ON analytics_events(user_id, created_at DESC);
CREATE INDEX analytics_events_beach_idx ON analytics_events(beach_id, created_at DESC);
CREATE INDEX analytics_events_widget_idx ON analytics_events(widget_id, created_at DESC);
CREATE INDEX analytics_events_created_idx ON analytics_events(created_at DESC);

-- Forecast data (pre-computed)
CREATE TABLE forecasts (
  id BIGSERIAL PRIMARY KEY,
  beach_id INT REFERENCES beaches(id) ON DELETE CASCADE,
  forecast_date DATE NOT NULL,
  wave_height_min NUMERIC(4,1),
  wave_height_max NUMERIC(4,1),
  wave_height_avg NUMERIC(4,1),
  wind_mph_min NUMERIC(4,1),
  wind_mph_max NUMERIC(4,1),
  wind_mph_avg NUMERIC(4,1),
  high_tide_times TIMESTAMPTZ[],
  low_tide_times TIMESTAMPTZ[],
  sunrise TIMESTAMPTZ,
  sunset TIMESTAMPTZ,
  source TEXT,
  confidence NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(beach_id, forecast_date)
);

-- Indexes for forecasts
CREATE INDEX forecasts_beach_date_idx ON forecasts(beach_id, forecast_date);
CREATE INDEX forecasts_date_idx ON forecasts(forecast_date);

-- Ingestion jobs tracking
CREATE TABLE ingestion_jobs (
  id BIGSERIAL PRIMARY KEY,
  job_type TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  records_processed INT DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ingestion_jobs
CREATE INDEX ingestion_jobs_status_idx ON ingestion_jobs(status, created_at DESC);
CREATE INDEX ingestion_jobs_type_idx ON ingestion_jobs(job_type, created_at DESC);

-- Manual overrides (admin)
CREATE TABLE manual_overrides (
  id BIGSERIAL PRIMARY KEY,
  beach_id INT REFERENCES beaches(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES users(id),
  override_type TEXT NOT NULL CHECK (override_type IN ('status', 'closure', 'notice')),
  value JSONB NOT NULL,
  reason TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for manual_overrides
CREATE INDEX manual_overrides_beach_idx ON manual_overrides(beach_id);
CREATE INDEX manual_overrides_active_idx ON manual_overrides(beach_id, starts_at, ends_at) 
  WHERE is_active = TRUE;

-- Insert initial islands
INSERT INTO islands (name, code, center_lat, center_lng, zoom_level) VALUES
  ('Oʻahu', 'oahu', 21.4389, -158.0001, 10),
  ('Maui', 'maui', 20.7984, -156.3319, 10),
  ('Kauaʻi', 'kauai', 22.0964, -159.5261, 10),
  ('Hawaiʻi', 'hawaii', 19.5429, -155.6659, 9);

-- Insert initial beaches (Oʻahu sample)
INSERT INTO beaches (island_id, name, slug, location, lat, lng, spot_type, noaa_station_id, doh_location_id) 
VALUES
  (1, 'Waikīkī Beach', 'waikiki', ST_MakePoint(-157.8281, 21.2765), 21.2765, -157.8281, 'family', '1612340', 'DOH-001'),
  (1, 'Ala Moana Beach', 'ala-moana', ST_MakePoint(-157.8472, 21.2909), 21.2909, -157.8472, 'family', '1612340', 'DOH-002'),
  (1, 'Sandy Beach', 'sandy-beach', ST_MakePoint(-157.6717, 21.2851), 21.2851, -157.6717, 'surf', '1612340', 'DOH-003'),
  (1, 'Lanikai Beach', 'lanikai', ST_MakePoint(-157.7142, 21.3929), 21.3929, -157.7142, 'family', '1611400', 'DOH-004'),
  (1, 'Sunset Beach', 'sunset', ST_MakePoint(-158.0404, 21.6795), 21.6795, -158.0404, 'surf', '1611400', 'DOH-005'),
  (1, 'Pipeline', 'pipeline', ST_MakePoint(-158.0493, 21.6654), 21.6654, -158.0493, 'surf', '1611400', 'DOH-006'),
  (1, 'Waimea Bay', 'waimea-bay', ST_MakePoint(-158.0639, 21.6425), 21.6425, -158.0639, 'surf', '1611400', 'DOH-007');

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_beaches_updated_at BEFORE UPDATE ON beaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisories_updated_at BEFORE UPDATE ON advisories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at BEFORE UPDATE ON widgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
GRANT ALL ON ALL TABLES IN SCHEMA public TO reef_safety_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO reef_safety_app;