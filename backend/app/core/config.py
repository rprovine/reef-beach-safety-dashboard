"""
Configuration settings for the Reef & Beach Safety Dashboard API
"""

from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, PostgresDsn, validator

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "Reef & Beach Safety Dashboard"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")
    DEBUG: bool = Field(True, env="DEBUG")
    
    # API
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: PostgresDsn = Field(..., env="DATABASE_URL")
    DB_POOL_SIZE: int = Field(20, env="DB_POOL_SIZE")
    DB_MAX_OVERFLOW: int = Field(40, env="DB_MAX_OVERFLOW")
    
    # Redis
    REDIS_URL: str = Field("redis://localhost:6379", env="REDIS_URL")
    
    # CORS
    ALLOWED_ORIGINS: List[str] = Field(
        ["http://localhost:3000", "https://reefbeachsafety.com"],
        env="ALLOWED_ORIGINS"
    )
    ALLOWED_HOSTS: List[str] = Field(
        ["localhost", "127.0.0.1", "reefbeachsafety.com", "api.reefbeachsafety.com"],
        env="ALLOWED_HOSTS"
    )
    
    # Stripe
    STRIPE_SECRET_KEY: str = Field(..., env="STRIPE_SECRET_KEY")
    STRIPE_WEBHOOK_SECRET: str = Field(..., env="STRIPE_WEBHOOK_SECRET")
    STRIPE_PRICE_CONSUMER: str = Field(..., env="STRIPE_PRICE_CONSUMER")
    STRIPE_PRICE_BUSINESS: str = Field(..., env="STRIPE_PRICE_BUSINESS")
    STRIPE_PRICE_ENTERPRISE: str = Field(..., env="STRIPE_PRICE_ENTERPRISE")
    
    # Clerk Auth
    CLERK_SECRET_KEY: str = Field(..., env="CLERK_SECRET_KEY")
    CLERK_WEBHOOK_SECRET: Optional[str] = Field(None, env="CLERK_WEBHOOK_SECRET")
    
    # SendGrid Email
    SENDGRID_API_KEY: str = Field(..., env="SENDGRID_API_KEY")
    SENDGRID_FROM_EMAIL: str = Field("alerts@reefbeachsafety.com", env="SENDGRID_FROM_EMAIL")
    
    # Twilio SMS
    TWILIO_ACCOUNT_SID: str = Field(..., env="TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN: str = Field(..., env="TWILIO_AUTH_TOKEN")
    TWILIO_FROM_NUMBER: str = Field(..., env="TWILIO_FROM_NUMBER")
    
    # Data Sources
    NOAA_API_BASE: str = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"
    PACIOOS_API_BASE: str = "https://www.pacioos.hawaii.edu/erddap"
    DOH_ADVISORY_URL: str = "https://eha-cloud.doh.hawaii.gov/cwb/"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(60, env="RATE_LIMIT_PER_MINUTE")
    RATE_LIMIT_PER_HOUR: int = Field(1000, env="RATE_LIMIT_PER_HOUR")
    
    # Cache TTL (seconds)
    CACHE_TTL_SHORT: int = 60  # 1 minute
    CACHE_TTL_MEDIUM: int = 300  # 5 minutes
    CACHE_TTL_LONG: int = 3600  # 1 hour
    
    # Job Settings
    JOB_INGEST_INTERVAL_MINUTES: int = Field(30, env="JOB_INGEST_INTERVAL_MINUTES")
    JOB_STATUS_COMPUTE_INTERVAL_MINUTES: int = Field(15, env="JOB_STATUS_COMPUTE_INTERVAL_MINUTES")
    JOB_ALERT_CHECK_INTERVAL_MINUTES: int = Field(5, env="JOB_ALERT_CHECK_INTERVAL_MINUTES")
    
    # Widget Settings
    WIDGET_CACHE_TTL: int = Field(120, env="WIDGET_CACHE_TTL")  # 2 minutes
    WIDGET_DOMAIN_WHITELIST: List[str] = Field([], env="WIDGET_DOMAIN_WHITELIST")
    
    # Beach Thresholds (defaults, can be overridden per beach)
    WAVE_HEIGHT_SAFE_MAX: float = 3.0
    WAVE_HEIGHT_CAUTION_MAX: float = 6.0
    WIND_SPEED_SAFE_MAX: float = 15.0
    WIND_SPEED_CAUTION_MAX: float = 25.0
    
    # Monitoring
    SENTRY_DSN: Optional[str] = Field(None, env="SENTRY_DSN")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @validator("ALLOWED_HOSTS", pre=True)
    def parse_allowed_hosts(cls, v):
        if isinstance(v, str):
            return [host.strip() for host in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()