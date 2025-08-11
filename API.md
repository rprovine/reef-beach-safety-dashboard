# 🌊 Reef & Beach Safety Dashboard API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Authentication

#### POST /auth/register
Create a new user account with 14-day free trial.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "808-555-0100" // Optional
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "free",
    "subscriptionStatus": "trial",
    "trialEndDate": "2024-02-14T00:00:00Z"
  },
  "message": "Registration successful! You have a 14-day free trial."
}
```

#### POST /auth/login
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "tier": "free",
    "subscription": { ... }
  }
}
```

### Alerts

#### GET /alerts
Get all alerts for the authenticated user.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "alerts": [
    {
      "id": "alert_id",
      "name": "Waikiki High Surf",
      "isActive": true,
      "channels": ["email", "sms"],
      "rules": [
        {
          "beach": {
            "name": "Waikiki Beach",
            "island": "oahu"
          },
          "metric": "wave_height_ft",
          "operator": "gt",
          "threshold": 6
        }
      ],
      "history": []
    }
  ],
  "tier": "free",
  "features": {
    "smsEnabled": false,
    "customRulesEnabled": false
  }
}
```

#### POST /alerts
Create a new beach alert.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "Pipeline High Surf Alert",
  "beachId": "beach_cuid",
  "metric": "wave_height_ft",
  "operator": "gt",
  "threshold": 8,
  "channels": ["email"],
  "timezone": "Pacific/Honolulu",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "alert": { ... },
  "message": "Alert created for Pipeline"
}
```

#### PATCH /alerts/:id
Update an existing alert.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "Updated Alert Name",
  "isActive": false,
  "channels": ["email", "sms"]
}
```

#### DELETE /alerts/:id
Delete an alert.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "message": "Alert deleted successfully"
}
```

### Public API (Business+ Tiers)

#### GET /v1/beaches
Get beach data with conditions and forecasts.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `island` - Filter by island (oahu, maui, kauai, hawaii)
- `status` - Filter by status (green, yellow, red)
- `include_conditions` - Include current conditions (boolean)
- `include_forecast` - Include forecast data (boolean)
- `historical_days` - Number of days of historical data (number)

**Response (200 OK):**
```json
{
  "beaches": [
    {
      "id": "beach_id",
      "name": "Waikiki Beach",
      "slug": "waikiki-beach",
      "island": "oahu",
      "lat": 21.2761,
      "lng": -157.8267,
      "readings": [ ... ],
      "advisories": [ ... ]
    }
  ],
  "count": 10,
  "metadata": {
    "tier": "business",
    "historicalDays": 7,
    "forecastDays": 7,
    "timestamp": "2024-01-31T00:00:00Z"
  }
}
```

### Payments

#### POST /payment/checkout
Create a checkout session for subscription upgrade.

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "tier": "consumer",
  "billingCycle": "monthly"
}
```

**Response (200 OK):**
```json
{
  "sessionId": "checkout_session_id",
  "url": "https://payment.hubspot.com/..."
}
```

## Rate Limits

Rate limits are enforced based on subscription tier:

| Tier | Hourly Limit | Daily Limit | Concurrent |
|------|-------------|-------------|------------|
| Free | No API access | - | - |
| Consumer | No API access | - | - |
| Business | 1,000 | 10,000 | 10 |
| Enterprise | Unlimited* | 100,000 | 100 |

*Enterprise has soft limits for abuse prevention

## Error Responses

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": { ... } // Optional additional context
}
```

### Common Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient tier/permissions)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `503` - Service Unavailable

## Webhooks

For Enterprise customers, we support webhooks for real-time updates:

```json
{
  "event": "alert.triggered",
  "data": {
    "alertId": "alert_id",
    "beachId": "beach_id",
    "condition": "high_surf",
    "value": 12.5,
    "timestamp": "2024-01-31T00:00:00Z"
  }
}
```

## SDKs

Coming soon:
- JavaScript/TypeScript SDK
- Python SDK
- PHP SDK
- Ruby SDK

## Support

- Free/Consumer: Email support
- Business: Priority support
- Enterprise: Dedicated support + SLA

For API support, contact: api@reefsafehawaii.com