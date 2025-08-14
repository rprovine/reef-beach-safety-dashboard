/**
 * Email validation utilities to prevent bounce backs
 */

// List of common test/invalid domains that should be blocked
const BLOCKED_DOMAINS = [
  'test.com',
  'example.com',
  'example.org',
  'example.net',
  'mailinator.com',
  'temp-mail.org',
  'guerrillamail.com',
  '10minutemail.com',
  'throwaway.email',
  'yopmail.com',
  'test.test',
  'aaa.com',
  'abc.com',
  'foo.com',
  'bar.com'
]

// List of common typos in email domains
const TYPO_DOMAINS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com'
}

/**
 * Validates an email address and returns validation result
 */
export function validateEmail(email: string): {
  isValid: boolean
  reason?: string
  suggestion?: string
} {
  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      reason: 'Invalid email format'
    }
  }

  const [localPart, domain] = email.toLowerCase().split('@')
  
  // Check for blocked domains
  if (BLOCKED_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      reason: 'Test or temporary email addresses are not allowed',
      suggestion: 'Please use a real email address'
    }
  }

  // Check for common typos
  if (TYPO_DOMAINS[domain]) {
    return {
      isValid: false,
      reason: 'Possible typo in email domain',
      suggestion: `Did you mean @${TYPO_DOMAINS[domain]}?`
    }
  }

  // Check for obviously fake patterns
  if (domain.includes('test') || domain.includes('fake') || domain.includes('example')) {
    return {
      isValid: false,
      reason: 'Invalid email domain',
      suggestion: 'Please use a real email address'
    }
  }

  // Check local part for obvious test patterns
  const testPatterns = ['test', 'fake', 'dummy', 'asdf', 'qwerty', 'abc123', 'xxx']
  if (testPatterns.some(pattern => localPart.includes(pattern))) {
    return {
      isValid: false,
      reason: 'Email address appears to be a test address',
      suggestion: 'Please use your real email address'
    }
  }

  return { isValid: true }
}

/**
 * Sanitizes an email address by fixing common typos
 */
export function sanitizeEmail(email: string): string {
  const [localPart, domain] = email.toLowerCase().trim().split('@')
  
  // Fix domain typos if found
  const fixedDomain = TYPO_DOMAINS[domain] || domain
  
  return `${localPart}@${fixedDomain}`
}

/**
 * Checks if email is in development/testing whitelist
 */
export function isWhitelistedEmail(email: string): boolean {
  const whitelist = [
    'rprovine@gmail.com',
    // Add other verified emails here
  ]
  
  return whitelist.includes(email.toLowerCase())
}

/**
 * Main validation function for production use
 */
export function validateEmailForSending(email: string): {
  canSend: boolean
  error?: string
  suggestion?: string
} {
  // In production, be more strict
  if (process.env.NODE_ENV === 'production') {
    // First check if it's whitelisted
    if (isWhitelistedEmail(email)) {
      return { canSend: true }
    }
    
    // Validate the email
    const validation = validateEmail(email)
    if (!validation.isValid) {
      return {
        canSend: false,
        error: validation.reason,
        suggestion: validation.suggestion
      }
    }
  }
  
  return { canSend: true }
}