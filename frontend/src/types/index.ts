export type Island = 'oahu' | 'maui' | 'kauai' | 'hawaii'

export type BeachStatus = 'green' | 'yellow' | 'red' | 'gray'

export type BeachSpotType = 'general' | 'surf' | 'family' | 'tidepool'

export type AlertChannel = 'email' | 'sms'

export type SubscriptionPlan = 'free' | 'consumer' | 'business' | 'enterprise'

export type UserRole = 'free' | 'consumer' | 'business' | 'admin'

export interface Beach {
  id: number
  name: string
  slug: string
  island: Island
  lat: number
  lng: number
  coordinates: {
    lat: number
    lng: number
  }
  spotType: BeachSpotType
  status: BeachStatus
  currentConditions?: CurrentConditions
  advisory?: Advisory
  updatedAt: Date
  isActive: boolean
}

export interface CurrentConditions {
  waveHeightFt: number | null
  windMph: number | null
  windDirection: number | null
  waterTempF: number | null
  tideFt: number | null
  timestamp: Date
}

export interface Advisory {
  id: number
  status: 'active' | 'resolved'
  title: string
  url?: string
  source: 'doh' | 'nws'
  startedAt: Date
  resolvedAt?: Date
}

export interface Reading {
  id: number
  beachId: number
  timestamp: Date
  waveHeightFt?: number
  windMph?: number
  windDirDeg?: number
  waterTempF?: number
  tideFt?: number
  source: 'noaa' | 'pacioos' | 'calc'
}

export interface Alert {
  id: number
  userId: string
  name: string
  channels: AlertChannel[]
  quietHours?: {
    start: string
    end: string
    tz: string
  }
  rules: AlertRule[]
  createdAt: Date
}

export interface AlertRule {
  id: number
  alertId: number
  beachId: number
  metric: 'wave_height_ft' | 'wind_mph' | 'advisory'
  operator: 'gt' | 'gte' | 'lt' | 'eq' | 'changed' | 'is_active'
  threshold?: number
}

export interface User {
  id: string
  email: string
  role: UserRole
  subscription?: Subscription
  createdAt: Date
}

export interface Subscription {
  id: number
  userId: string
  plan: SubscriptionPlan
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  status: 'active' | 'past_due' | 'canceled'
  startedAt: Date
  canceledAt?: Date
}

export interface Widget {
  id: number
  userId: string
  name: string
  config: {
    beaches: number[]
    theme: {
      accent: string
      font?: string
    }
    layout: 'card' | 'map' | 'ticker'
  }
  embedToken: string
  createdAt: Date
}

export interface Forecast {
  beachId: number
  date: Date
  waveHeightFt: {
    min: number
    max: number
    avg: number
  }
  windMph: {
    min: number
    max: number
    avg: number
  }
  tides: TidePoint[]
}

export interface TidePoint {
  time: Date
  height: number
  type: 'high' | 'low'
}

export interface StatusReason {
  waveHeightFt?: number
  windMph?: number
  advisory?: boolean
  lastUpdate?: Date
}

export interface BeachDetailResponse {
  beach: Beach
  currentConditions: CurrentConditions
  forecast7Day: Forecast[]
  history30Day: Reading[]
  advisories: Advisory[]
  tides: TidePoint[]
}