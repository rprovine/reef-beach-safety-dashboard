# Email System Documentation

## Overview
The Beach Hui application has a comprehensive email system that handles all user communications throughout their journey.

## Email Service Provider
We use **Resend** for transactional emails. To set up:

1. Create an account at [Resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to your environment variables:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

## Email Types Implemented

### 1. Welcome Email (✅ Implemented)
- **Trigger**: New user registration
- **File**: `src/app/api/auth/register/route.ts`
- **Template**: `emailTemplates.welcomeWithTrial()`
- **Content**: Welcome message, 14-day trial info, Pro features list

### 2. Trial Expiring Reminder (✅ Implemented)
- **Trigger**: 3 days before trial ends (daily cron job)
- **File**: `src/app/api/cron/check-subscriptions/route.ts`
- **Template**: `emailTemplates.trialExpiring()`
- **Content**: Days remaining, special offer (20% discount), feature reminder

### 3. Trial Expired (✅ Implemented)
- **Trigger**: When trial ends (daily cron job)
- **File**: `src/app/api/cron/check-subscriptions/route.ts`
- **Template**: `emailTemplates.trialExpired()`
- **Content**: Trial ended notice, Free tier features, upgrade CTA

### 4. Subscription Confirmation (✅ Implemented)
- **Trigger**: Successful payment via HubSpot webhook
- **File**: `src/app/api/webhooks/hubspot/route.ts`
- **Template**: `emailTemplates.subscriptionConfirmed()`
- **Content**: Payment confirmation, plan details, Pro features

### 5. Subscription Cancellation (✅ Implemented)
- **Trigger**: User cancels subscription
- **File**: `src/app/api/subscription/cancel/route.ts`
- **Template**: `emailTemplates.subscriptionCanceled()`
- **Content**: Cancellation confirmation, access end date, reactivation option

### 6. Password Reset (✅ Implemented)
- **Trigger**: User requests password reset
- **Files**: 
  - Request: `src/app/api/auth/forgot-password/route.ts`
  - Reset: `src/app/api/auth/reset-password/route.ts`
- **Template**: `emailTemplates.passwordReset()`
- **Content**: Reset link (1-hour expiry), security notice

## Testing Emails

### Test Endpoint
Use the test endpoint to verify all email templates:

```bash
# Test a specific email type
curl -X POST http://localhost:3000/api/test-emails \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "type": "welcome"}'

# Test all email types
curl -X POST http://localhost:3000/api/test-emails \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "type": "all"}'
```

Available test types:
- `welcome` - Welcome email with trial info
- `trial-expiring` - Trial expiring in 3 days
- `trial-expired` - Trial has ended
- `subscription-confirmed` - Payment confirmed
- `subscription-canceled` - Cancellation confirmed
- `password-reset` - Password reset link
- `all` - Send all types (with delays)

## Email Flow Diagram

```
User Registration
    ↓
Welcome Email (with 14-day trial info)
    ↓
[Day 11] Trial Expiring Reminder (3 days left)
    ↓
[Day 14] Trial Expired Email
    ↓
    ├─→ User Upgrades → Subscription Confirmation Email
    └─→ User Stays Free → (No further emails)

Subscription Active
    ↓
User Cancels → Cancellation Confirmation Email
    ↓
[End Date] → Subscription Expired (switches to Free)
```

## Cron Job Schedule

The daily cron job (`/api/cron/check-subscriptions`) runs at 2 AM UTC and:
1. Checks for expired trials → Sends expired email
2. Checks for trials expiring in 3 days → Sends reminder email
3. Checks for expired canceled subscriptions → Downgrades to Free

## Environment Variables Required

```env
# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx

# App URL (for email links)
NEXT_PUBLIC_APP_URL=https://beachhui.com

# HubSpot (for payment webhooks)
HUBSPOT_ACCESS_TOKEN=xxx
HUBSPOT_WEBHOOK_SECRET=xxx
HUBSPOT_PORTAL_ID=xxx

# Cron Secret (optional, for securing cron endpoints)
CRON_SECRET=your-secret-key
```

## Email Templates Location

All email templates are in: `src/lib/email-templates.ts`

Each template includes:
- Subject line
- HTML version (styled)
- Text version (fallback)

## Monitoring & Logs

Email sending is logged in the console:
- Success: `"[Email type] email sent to: [email]"`
- Failure: `"Failed to send [email type] to [email]: [error]"`

Check Vercel logs for production email status:
```bash
vercel logs --follow
```

## Troubleshooting

### Emails not sending?
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain is configured in Resend dashboard
3. Check Vercel logs for error messages
4. Use test endpoint to debug specific templates

### Wrong email content?
1. Check template in `src/lib/email-templates.ts`
2. Verify correct template is being called
3. Check data being passed to template

### Cron jobs not running?
1. Verify `vercel.json` has cron configuration
2. Check Vercel dashboard → Functions → Cron Jobs
3. Manually trigger: `POST /api/cron/check-subscriptions`

## Future Enhancements

Potential additions:
- [ ] Weekly beach report digest
- [ ] Alert notification emails (when beach conditions trigger alerts)
- [ ] Community activity notifications
- [ ] Annual subscription renewal reminders
- [ ] Re-engagement campaigns for inactive users

## Support

For email issues:
1. Check this documentation
2. Review Resend dashboard for delivery status
3. Check application logs in Vercel
4. Contact support with email address and timestamp