export class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null

  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported')
      return false
    }

    try {
      // Wait for service worker to be ready
      this.registration = await navigator.serviceWorker.ready
      console.log('Service Worker ready for push notifications')
      return true
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications not supported')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      console.log('Notification permission denied')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  async subscribe() {
    if (!this.registration) {
      await this.init()
    }

    if (!this.registration) {
      throw new Error('Service worker not registered')
    }

    const permission = await this.requestPermission()
    if (!permission) {
      throw new Error('Notification permission denied')
    }

    try {
      // Get the subscription
      let subscription = await this.registration.pushManager.getSubscription()

      if (!subscription) {
        // Create a new subscription
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
          throw new Error('VAPID public key not configured')
        }

        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
        })
      }

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription)
      
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  async unsubscribe() {
    if (!this.registration) {
      return
    }

    const subscription = await this.registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      await this.removeSubscriptionFromServer(subscription)
    }
  }

  private urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    })

    if (!response.ok) {
      throw new Error('Failed to save subscription on server')
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription) {
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    })
  }

  // Send a local notification (for testing)
  async sendLocalNotification(title: string, options?: NotificationOptions) {
    if (!this.registration) {
      await this.init()
    }

    if (!this.registration) {
      throw new Error('Service worker not registered')
    }

    const permission = await this.requestPermission()
    if (!permission) {
      throw new Error('Notification permission denied')
    }

    return this.registration.showNotification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [200, 100, 200],
      ...options
    })
  }
}

// Singleton instance
export const pushNotifications = new PushNotificationService()

// Helper functions for specific notification types
export const notificationTemplates = {
  beachAlert: (beach: string, condition: string, severity: string) => ({
    title: `⚠️ ${beach} Alert`,
    body: condition,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: `beach-alert-${beach}`,
    requireInteraction: severity === 'high' || severity === 'extreme',
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    data: {
      type: 'beach-alert',
      beach,
      condition,
      severity,
      url: `/beaches/${beach.toLowerCase().replace(/ /g, '-')}`
    }
  }),

  uvWarning: (beach: string, uvIndex: number) => ({
    title: `☀️ Extreme UV Warning`,
    body: `UV Index ${uvIndex} at ${beach} - Seek shade immediately!`,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'uv-warning',
    requireInteraction: true,
    vibrate: [500, 200, 500],
    data: {
      type: 'uv-warning',
      beach,
      uvIndex,
      url: `/beaches/${beach.toLowerCase().replace(/ /g, '-')}`
    }
  }),

  communityReport: (beach: string, reportType: string) => ({
    title: `📍 New Report: ${beach}`,
    body: `Community member reported ${reportType}`,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: `community-${beach}`,
    actions: [
      { action: 'view', title: 'View Report' }
    ],
    data: {
      type: 'community-report',
      beach,
      reportType,
      url: `/community?beach=${beach.toLowerCase().replace(/ /g, '-')}`
    }
  }),

  dailyReport: () => ({
    title: '🌅 Your Daily Beach Report',
    body: 'Check today\'s best beaches and conditions',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'daily-report',
    actions: [
      { action: 'view', title: 'View Report' },
      { action: 'later', title: 'Later' }
    ],
    data: {
      type: 'daily-report',
      url: '/dashboard'
    }
  })
}