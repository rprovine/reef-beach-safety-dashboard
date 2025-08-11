"""
Beach-related database models
"""

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, 
    JSON, ARRAY, Numeric, Text, Enum as SQLEnum, UniqueConstraint, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geography
import enum
from datetime import datetime
import uuid

from app.core.database import Base

class SpotType(str, enum.Enum):
    GENERAL = "general"
    SURF = "surf"
    FAMILY = "family"
    TIDEPOOL = "tidepool"

class BeachStatus(str, enum.Enum):
    GREEN = "green"
    YELLOW = "yellow"
    RED = "red"
    GRAY = "gray"

class Island(Base):
    __tablename__ = "islands"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    zoom_level = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    beaches = relationship("Beach", back_populates="island", cascade="all, delete-orphan")

class Beach(Base):
    __tablename__ = "beaches"
    
    id = Column(Integer, primary_key=True, index=True)
    island_id = Column(Integer, ForeignKey("islands.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    location = Column(Geography(geometry_type='POINT', srid=4326), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    spot_type = Column(SQLEnum(SpotType), default=SpotType.GENERAL)
    
    # External data source IDs
    noaa_station_id = Column(String)
    pacioos_station_id = Column(String)
    doh_location_id = Column(String)
    
    # Threshold settings
    wave_threshold_safe = Column(Numeric(4, 1), default=3.0)
    wave_threshold_caution = Column(Numeric(4, 1), default=6.0)
    wind_threshold_safe = Column(Numeric(4, 1), default=15.0)
    wind_threshold_caution = Column(Numeric(4, 1), default=25.0)
    
    # Metadata
    is_active = Column(Boolean, default=True, index=True)
    metadata = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    island = relationship("Island", back_populates="beaches")
    readings = relationship("Reading", back_populates="beach", cascade="all, delete-orphan")
    advisories = relationship("Advisory", back_populates="beach", cascade="all, delete-orphan")
    status_history = relationship("BeachStatusSnapshot", back_populates="beach", cascade="all, delete-orphan")
    alert_rules = relationship("AlertRule", back_populates="beach", cascade="all, delete-orphan")
    forecasts = relationship("Forecast", back_populates="beach", cascade="all, delete-orphan")
    overrides = relationship("ManualOverride", back_populates="beach", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_beaches_location', 'location', postgresql_using='gist'),
        Index('idx_beaches_active', 'is_active'),
    )

class Reading(Base):
    __tablename__ = "readings"
    
    id = Column(Integer, primary_key=True, index=True)
    beach_id = Column(Integer, ForeignKey("beaches.id", ondelete="CASCADE"))
    ts = Column(DateTime, nullable=False, index=True)
    
    # Measurements
    wave_height_ft = Column(Numeric(4, 1))
    wave_period_sec = Column(Numeric(4, 1))
    wind_mph = Column(Numeric(4, 1))
    wind_dir_deg = Column(Numeric(5, 1))
    water_temp_f = Column(Numeric(4, 1))
    tide_ft = Column(Numeric(5, 2))
    
    # Source info
    source = Column(String, nullable=False)  # 'noaa', 'pacioos', 'calc', 'manual'
    raw_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    beach = relationship("Beach", back_populates="readings")
    
    # Indexes
    __table_args__ = (
        Index('idx_readings_beach_ts', 'beach_id', 'ts'),
    )

class Advisory(Base):
    __tablename__ = "advisories"
    
    id = Column(Integer, primary_key=True, index=True)
    beach_id = Column(Integer, ForeignKey("beaches.id", ondelete="CASCADE"))
    source = Column(String, nullable=False)  # 'doh', 'nws', 'manual'
    status = Column(String, nullable=False)  # 'active', 'resolved'
    severity = Column(String, default='warning')  # 'info', 'warning', 'danger'
    title = Column(String, nullable=False)
    description = Column(Text)
    url = Column(String)
    started_at = Column(DateTime, nullable=False, index=True)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    beach = relationship("Beach", back_populates="advisories")
    
    # Indexes
    __table_args__ = (
        Index('idx_advisories_beach_status', 'beach_id', 'status'),
        Index('idx_advisories_active', 'beach_id', postgresql_where="status = 'active'"),
    )

class BeachStatusSnapshot(Base):
    __tablename__ = "beach_status"
    
    id = Column(Integer, primary_key=True, index=True)
    beach_id = Column(Integer, ForeignKey("beaches.id", ondelete="CASCADE"))
    ts = Column(DateTime, nullable=False, index=True)
    status = Column(SQLEnum(BeachStatus), nullable=False)
    
    # Current conditions at time of snapshot
    wave_height_ft = Column(Numeric(4, 1))
    wind_mph = Column(Numeric(4, 1))
    has_advisory = Column(Boolean, default=False)
    
    # Reason for status
    reason = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    beach = relationship("Beach", back_populates="status_history")
    
    # Constraints and indexes
    __table_args__ = (
        UniqueConstraint('beach_id', 'ts'),
        Index('idx_beach_status_beach_ts', 'beach_id', 'ts'),
    )

class Forecast(Base):
    __tablename__ = "forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    beach_id = Column(Integer, ForeignKey("beaches.id", ondelete="CASCADE"))
    forecast_date = Column(DateTime, nullable=False)
    
    # Wave forecast
    wave_height_min = Column(Numeric(4, 1))
    wave_height_max = Column(Numeric(4, 1))
    wave_height_avg = Column(Numeric(4, 1))
    
    # Wind forecast
    wind_mph_min = Column(Numeric(4, 1))
    wind_mph_max = Column(Numeric(4, 1))
    wind_mph_avg = Column(Numeric(4, 1))
    
    # Tides
    high_tide_times = Column(ARRAY(DateTime))
    low_tide_times = Column(ARRAY(DateTime))
    
    # Sun times
    sunrise = Column(DateTime)
    sunset = Column(DateTime)
    
    # Metadata
    source = Column(String)
    confidence = Column(Numeric(3, 2))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    beach = relationship("Beach", back_populates="forecasts")
    
    # Constraints and indexes
    __table_args__ = (
        UniqueConstraint('beach_id', 'forecast_date'),
        Index('idx_forecasts_beach_date', 'beach_id', 'forecast_date'),
    )

class ManualOverride(Base):
    __tablename__ = "manual_overrides"
    
    id = Column(Integer, primary_key=True, index=True)
    beach_id = Column(Integer, ForeignKey("beaches.id", ondelete="CASCADE"))
    admin_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    override_type = Column(String, nullable=False)  # 'status', 'closure', 'notice'
    value = Column(JSON, nullable=False)
    reason = Column(Text)
    starts_at = Column(DateTime, nullable=False)
    ends_at = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    beach = relationship("Beach", back_populates="overrides")
    admin_user = relationship("User")
    
    # Indexes
    __table_args__ = (
        Index('idx_overrides_beach', 'beach_id'),
        Index('idx_overrides_active', 'beach_id', 'starts_at', 'ends_at', 
              postgresql_where="is_active = TRUE"),
    )