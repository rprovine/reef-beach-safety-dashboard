# Security Policy - Beach Hui
*Managed by LeniLani Consulting*

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email info@lenilani.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

**Please do not open public issues for security vulnerabilities.**

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Session Management**: Secure cookie handling
- **Role-Based Access**: User, Premium, Admin tiers

### Data Protection
```javascript
// Password hashing
const hashedPassword = await bcrypt.hash(password, 12)

// JWT signing
const token = jwt.sign(
  { userId, email, tier },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)
```

### API Security

#### Rate Limiting
- Default: 60 requests/minute per IP
- Authenticated: 120 requests/minute
- Premium: 300 requests/minute

#### Input Validation
```typescript
// Zod schema validation
const beachQuerySchema = z.object({
  island: z.enum(['oahu', 'maui', 'kauai', 'hawaii']).optional(),
  status: z.enum(['good', 'caution', 'dangerous']).optional(),
  limit: z.number().min(1).max(100).default(50)
})
```

### Security Headers

```javascript
// next.config.js
headers: [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
]
```

### Database Security

#### SQL Injection Prevention
Using Prisma ORM with parameterized queries:
```typescript
// Safe query
const beach = await prisma.beach.findUnique({
  where: { slug: userInput } // Automatically escaped
})

// Never do this
const unsafe = `SELECT * FROM beaches WHERE slug = '${userInput}'`
```

#### Connection Security
- SSL/TLS encrypted connections
- Connection pooling with Supabase
- Row-level security policies

### Environment Variables

#### Required Security Variables
```env
# Authentication
JWT_SECRET=<32+ character random string>
ENCRYPTION_KEY=<32 character key>

# Database
DATABASE_URL=<connection string with SSL>

# API Keys (never commit!)
OPENWEATHER_API_KEY=<api key>
```

#### Best Practices
1. Never commit `.env` files
2. Use `.env.local` for development
3. Set production variables in hosting platform
4. Rotate keys regularly
5. Use different keys for dev/staging/prod

### CORS Configuration

```typescript
// Allowed origins
const allowedOrigins = [
  'https://beachhui.com',
  'https://www.beachhui.com',
  process.env.NEXT_PUBLIC_APP_URL
]

// CORS headers
if (origin && allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}
```

### XSS Prevention

#### Content Security Policy
```javascript
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://api.openweathermap.org;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.openweathermap.org;
```

#### Output Encoding
```typescript
// React automatically escapes content
<div>{userInput}</div> // Safe

// Dangerous - never do this
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

### Dependency Security

#### Regular Updates
```bash
# Check for vulnerabilities
npm audit

# Auto-fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated

# Update dependencies
npm update
```

#### Dependency Monitoring
- GitHub Dependabot enabled
- Weekly security updates
- Automated PR for patches

### Logging & Monitoring

#### Security Events to Log
- Failed login attempts
- Password reset requests
- API rate limit violations
- Suspicious activity patterns
- Admin actions

#### Log Format
```json
{
  "timestamp": "2024-01-11T12:00:00Z",
  "event": "failed_login",
  "userId": "user_123",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "details": {
    "email": "user@example.com",
    "reason": "invalid_password"
  }
}
```

### Deployment Security

#### Vercel Settings
- Enable HTTPS only
- Set security headers
- Configure firewall rules
- Enable DDoS protection

#### Environment Security
```bash
# Production checks
- [ ] All secrets in environment variables
- [ ] Debug mode disabled
- [ ] Error messages sanitized
- [ ] Source maps disabled in production
- [ ] Admin routes protected
```

### Incident Response

#### Response Plan
1. **Identify** - Detect and confirm incident
2. **Contain** - Limit damage and prevent spread
3. **Investigate** - Determine scope and impact
4. **Remediate** - Fix vulnerability
5. **Recover** - Restore normal operations
6. **Review** - Post-incident analysis

#### Contact Information
- Security Team: info@lenilani.com
- Company: LeniLani Consulting
- Website: https://lenilani.com

### Compliance

#### Data Privacy
- GDPR compliant for EU users
- CCPA compliant for California users
- User data deletion on request
- Data export functionality

#### Security Standards
- OWASP Top 10 mitigation
- PCI DSS for payment processing
- SOC 2 Type II (planned)

### Security Checklist

#### Pre-Deployment
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Authentication required for sensitive routes
- [ ] Error messages don't leak information
- [ ] Logging configured
- [ ] SSL certificate valid

#### Post-Deployment
- [ ] Security scan completed
- [ ] Penetration testing (quarterly)
- [ ] Dependency audit
- [ ] Access logs reviewed
- [ ] Backup restoration tested

### Security Tools

#### Recommended Tools
- **npm audit** - Dependency scanning
- **ESLint Security Plugin** - Code analysis
- **OWASP ZAP** - Security testing
- **Lighthouse** - Performance & security audit
- **Snyk** - Vulnerability monitoring

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2024 | Initial security implementation |
| 1.1.0 | Jan 2024 | Added rate limiting and CSP |

---

**Last Updated**: January 2024
**Next Review**: April 2024
**Contact**: info@lenilani.com
**Company**: LeniLani Consulting