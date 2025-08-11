# Beach Hui API Documentation
*Powered by LeniLani Consulting*

## Table of Contents
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Webhooks](#webhooks)

## Base URL
```
Production: https://beachhui.com/api
Development: http://localhost:3001/api
```

## Authentication

### Public Endpoints
Most read-only beach data endpoints are public and don't require authentication.

### Protected Endpoints
User-specific features require JWT authentication:
```http
Authorization: Bearer <token>
```

## Rate Limiting

All API endpoints are rate-limited:
- **Default**: 60 requests per minute per IP
- **Authenticated**: 120 requests per minute per user
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets
  - `Retry-After`: Seconds to wait (on 429 responses)

## Endpoints

### Beach Data

#### GET /api/beaches
Get list of all beaches with basic information.

**Query Parameters:**
- `island` (string): Filter by island (oahu, maui, kauai, hawaii, molokai, lanai)
- `status` (string): Filter by status (good, caution, dangerous)
- `search` (string): Search beaches by name
- `limit` (number): Limit results (default: 50)
- `offset` (number): Pagination offset

**Response:**
```json
{
  "beaches": [
    {
      "id": "waikiki-beach",
      "slug": "waikiki-beach",
      "name": "Waikiki Beach",
      "island": "oahu",
      "lat": 21.2762,
      "lng": -157.8267,
      "currentStatus": "good",
      "safetyScore": 85,
      "lastUpdated": "2024-01-11T12:00:00Z"
    }
  ],
  "total": 71,
  "limit": 50,
  "offset": 0
}
```

#### GET /api/beaches/[slug]
Get detailed information for a specific beach.

**Response:**
```json
{
  "beach": {
    "id": "waikiki-beach",
    "slug": "waikiki-beach",
    "name": "Waikiki Beach",
    "island": "oahu",
    "coordinates": {
      "lat": 21.2762,
      "lng": -157.8267
    },
    "description": "Famous beach in Honolulu...",
    "amenities": {
      "parking": true,
      "restrooms": true,
      "showers": true,
      "picnicArea": true,
      "bbqGrills": false
    },
    "activities": {
      "swimming": "excellent",
      "surfing": "good",
      "snorkeling": "fair",
      "diving": "poor"
    },
    "safetyInfo": {
      "lifeguard": true,
      "hazards": ["strong currents", "jellyfish"],
      "difficulty": "beginner"
    }
  },
  "currentConditions": {
    "temperature": 27,
    "waterTemp": 25,
    "windSpeed": 12,
    "windDirection": "NE",
    "waveHeight": 2.5,
    "visibility": 10,
    "uvIndex": 11,
    "tide": "rising"
  },
  "warnings": [],
  "lastUpdated": "2024-01-11T12:00:00Z"
}
```

#### GET /api/beaches/[slug]/comprehensive
Get all available data including weather, reef health, and forecasts.

**Response:**
```json
{
  "beach": { /* beach details */ },
  "currentConditions": { /* real-time conditions */ },
  "weather": {
    "current": { /* OpenWeather data */ },
    "forecast": [ /* 7-day forecast */ ],
    "activities": {
      "swimming": "excellent",
      "surfing": "good",
      "snorkeling": "excellent"
    }
  },
  "reef": {
    "health": {
      "healthScore": 75,
      "coralCoverage": 45,
      "bleaching": {
        "status": "mild",
        "percentage": 12
      }
    },
    "ecosystem": {
      "biodiversityScore": 82,
      "speciesCount": 127,
      "protectedSpecies": { /* sightings */ }
    },
    "hazards": {
      "sharpCoral": "moderate",
      "seaUrchin": "low",
      "venomous": { /* warnings */ }
    }
  },
  "tides": [ /* tide times */ ],
  "advisories": [ /* active warnings */ ],
  "forecast7Day": [ /* extended forecast */ ]
}
```

### User Features

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe",
  "tier": "free"
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "premium"
  }
}
```

#### POST /api/alerts
Create a beach alert subscription (requires auth).

**Request Body:**
```json
{
  "beachId": "waikiki-beach",
  "alertTypes": ["dangerous_conditions", "jellyfish", "high_bacteria"],
  "notificationMethod": "email"
}
```

#### GET /api/alerts
Get user's alert subscriptions (requires auth).

#### DELETE /api/alerts/[id]
Remove an alert subscription (requires auth).

### Community Features

#### POST /api/community/reports
Submit a community beach report (requires auth).

**Request Body:**
```json
{
  "beachId": "waikiki-beach",
  "type": "hazard",
  "severity": "moderate",
  "title": "Strong rip current near pier",
  "description": "Observed strong rip current...",
  "location": {
    "lat": 21.2762,
    "lng": -157.8267
  },
  "photos": []
}
```

### Data Export

#### GET /api/v1/beaches
Public API endpoint for third-party integrations.

**Headers Required:**
```http
X-API-Key: your_api_key
```

**Query Parameters:**
- All standard beach query parameters
- `format` (string): json (default) or csv

## Data Models

### Beach Status Enum
```typescript
enum BeachStatus {
  GOOD = 'good',        // Safe conditions
  CAUTION = 'caution',  // Use caution
  DANGEROUS = 'dangerous' // Hazardous conditions
}
```

### Activity Rating Enum
```typescript
enum ActivityRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}
```

### Reef Health Status
```typescript
enum ReefHealth {
  EXCELLENT = 'excellent', // 80-100 score
  GOOD = 'good',          // 60-79 score
  FAIR = 'fair',          // 40-59 score
  POOR = 'poor',          // 20-39 score
  CRITICAL = 'critical'   // 0-19 score
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Beach not found",
    "details": {
      "beachId": "invalid-beach"
    }
  },
  "timestamp": "2024-01-11T12:00:00Z"
}
```

### Common Error Codes
- `400` Bad Request - Invalid parameters
- `401` Unauthorized - Missing or invalid auth token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource doesn't exist
- `429` Too Many Requests - Rate limit exceeded
- `500` Internal Server Error - Server error
- `503` Service Unavailable - External API down

## Webhooks

### Beach Alert Webhook
Sent when beach conditions change significantly.

**Payload:**
```json
{
  "event": "beach.status.changed",
  "timestamp": "2024-01-11T12:00:00Z",
  "data": {
    "beachId": "waikiki-beach",
    "previousStatus": "good",
    "currentStatus": "caution",
    "reason": "High bacteria levels detected",
    "safetyScore": 45
  }
}
```

## External APIs Used

### OpenWeather API
- Current weather conditions
- UV Index monitoring
- 7-day forecasts
- Update frequency: 10 minutes

### NOAA APIs
- Tide predictions
- Water temperature
- Marine forecasts
- Update frequency: 1 hour

### StormGlass API (Optional)
- Wave height and period
- Swell direction
- Marine weather
- Update frequency: 1 hour

## SDK Examples

### JavaScript/TypeScript
```typescript
import { BeachHuiClient } from '@beachhui/sdk'

const client = new BeachHuiClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://beachhui.com/api'
})

// Get beach data
const beach = await client.beaches.get('waikiki-beach')

// Subscribe to alerts
await client.alerts.subscribe({
  beachId: 'waikiki-beach',
  types: ['dangerous_conditions']
})
```

### Python
```python
from beachhui import BeachHuiClient

client = BeachHuiClient(
    api_key='your_api_key'
)

# Get all beaches on Oahu
beaches = client.beaches.list(island='oahu')

# Get comprehensive data
data = client.beaches.get_comprehensive('waikiki-beach')
```

### cURL
```bash
# Get beach list
curl https://beachhui.com/api/beaches \
  -H "Accept: application/json"

# Get specific beach with auth
curl https://beachhui.com/api/beaches/waikiki-beach \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Rate Limits by Tier

| Tier | Requests/Minute | Requests/Day | API Key |
|------|----------------|--------------|---------|
| Free | 60 | 1,000 | No |
| Basic | 120 | 5,000 | Yes |
| Premium | 300 | 20,000 | Yes |
| Business | 600 | 100,000 | Yes |

## Changelog

### v1.0.0 (January 2024)
- Initial API release
- Beach data endpoints
- Weather integration
- Reef health monitoring
- Authentication system
- Rate limiting
- Community reports

## Support

For API support and questions:
- Email: api@beachhui.com
- GitHub Issues: https://github.com/beachhui/api-issues
- Documentation: https://docs.beachhui.com