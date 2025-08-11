import ReactGA from 'react-ga4'
import mixpanel from 'mixpanel-browser'

// Google Analytics configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

export const initGA = () => {
  if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
    ReactGA.initialize(GA_MEASUREMENT_ID)
  }
}

export const logPageView = (url: string) => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: 'pageview', page: url })
  }
}

export const logEvent = (category: string, action: string, label?: string, value?: number) => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    })
  }
}

// Mixpanel configuration
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || ''

export const initMixpanel = () => {
  if (MIXPANEL_TOKEN && typeof window !== 'undefined') {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    })
  }
}

export const trackEvent = (event: string, properties?: any) => {
  if (MIXPANEL_TOKEN) {
    mixpanel.track(event, properties)
  }
}

export const identifyUser = (userId: string, properties?: any) => {
  if (MIXPANEL_TOKEN) {
    mixpanel.identify(userId)
    if (properties) {
      mixpanel.people.set(properties)
    }
  }
}

// Conversion tracking
export const trackConversion = (type: 'signup' | 'upgrade' | 'alert_created' | 'report_submitted', value?: number) => {
  logEvent('Conversion', type, undefined, value)
  trackEvent(`conversion_${type}`, { value })
  
  // Send to Google Ads if configured
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
      value: value,
      currency: 'USD',
    })
  }
}

// User engagement tracking
export const trackEngagement = (action: string, details?: any) => {
  logEvent('Engagement', action, details?.label)
  trackEvent(`engagement_${action}`, details)
}

// Beach interaction tracking
export const trackBeachView = (beachName: string, beachId: string) => {
  logEvent('Beach', 'view', beachName)
  trackEvent('beach_viewed', { beach_name: beachName, beach_id: beachId })
}

export const trackBeachAlert = (beachName: string, alertType: string) => {
  logEvent('Alert', 'created', `${beachName}_${alertType}`)
  trackEvent('alert_created', { beach_name: beachName, alert_type: alertType })
}

export const trackSocialShare = (platform: string, content: string) => {
  logEvent('Social', 'share', platform)
  trackEvent('social_share', { platform, content })
}