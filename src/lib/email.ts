import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

// Email templates
export const templates = {
  welcome: (name: string, email: string) => ({
    subject: '🌊 Welcome to Beach Hui - Your Hawaiian Beach Safety Companion',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Aloha ${name}! 🌺</h1>
        </div>
        <div style="padding: 30px; background: #f7f7f7;">
          <h2 style="color: #333;">Welcome to Beach Hui!</h2>
          <p style="color: #666; line-height: 1.6;">
            Your gateway to safer beach experiences across Hawaii. Here's what you can do:
          </p>
          <ul style="color: #666; line-height: 2;">
            <li>🏖️ Check real-time conditions at 70+ beaches</li>
            <li>🌊 Get personalized safety alerts</li>
            <li>🐠 Track marine life sightings</li>
            <li>☀️ Monitor UV levels (up to UV 13!)</li>
            <li>🤝 Connect with the beach community</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/beaches" 
               style="background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Explore Beaches Now
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            Questions? Reply to this email or visit our help center.
          </p>
        </div>
      </div>
    `,
    text: `Aloha ${name}! Welcome to Beach Hui. Check real-time beach conditions, get safety alerts, and connect with the beach community. Visit ${process.env.NEXT_PUBLIC_APP_URL}/beaches to get started.`
  }),

  alert: (beachName: string, condition: string, severity: 'low' | 'medium' | 'high' | 'extreme') => ({
    subject: `⚠️ ${severity.toUpperCase()} Alert: ${beachName} - ${condition}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${
          severity === 'extreme' ? '#DC2626' :
          severity === 'high' ? '#F97316' :
          severity === 'medium' ? '#F59E0B' :
          '#22C55E'
        }; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Beach Alert</h1>
        </div>
        <div style="padding: 30px; background: #f7f7f7;">
          <h2 style="color: #333;">${beachName}</h2>
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="color: #666; font-size: 18px; margin: 0;">
              <strong>Condition:</strong> ${condition}
            </p>
            <p style="color: #999; margin-top: 10px;">
              Severity: <span style="color: ${
                severity === 'extreme' ? '#DC2626' :
                severity === 'high' ? '#F97316' :
                severity === 'medium' ? '#F59E0B' :
                '#22C55E'
              }; font-weight: bold;">${severity.toUpperCase()}</span>
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/beaches/${beachName.toLowerCase().replace(/ /g, '-')}" 
               style="background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Beach Details
            </a>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            You're receiving this because you subscribed to alerts for ${beachName}.
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts" style="color: #4F46E5;">Manage alerts</a>
          </p>
        </div>
      </div>
    `,
    text: `Beach Alert for ${beachName}: ${condition} (Severity: ${severity}). Visit ${process.env.NEXT_PUBLIC_APP_URL}/beaches/${beachName.toLowerCase().replace(/ /g, '-')} for details.`
  }),

  dailyReport: (beaches: any[], userName: string) => ({
    subject: '🌅 Your Daily Beach Report - Beach Hui',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Daily Beach Report</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Good morning, ${userName}!</p>
        </div>
        <div style="padding: 30px; background: #f7f7f7;">
          <h2 style="color: #333;">Today's Top Beaches</h2>
          ${beaches.map(beach => `
            <div style="background: white; padding: 15px; border-radius: 10px; margin: 15px 0;">
              <h3 style="color: #333; margin: 0 0 10px 0;">${beach.name}</h3>
              <div style="display: flex; justify-content: space-between; color: #666;">
                <span>🌊 Waves: ${beach.waveHeight}ft</span>
                <span>🌡️ Water: ${beach.waterTemp}°F</span>
                <span>☀️ UV: ${beach.uvIndex}</span>
              </div>
              <p style="color: #22C55E; margin: 10px 0 0 0;">Safety Score: ${beach.safetyScore}/100</p>
            </div>
          `).join('')}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/beaches" 
               style="background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View All Beaches
            </a>
          </div>
        </div>
      </div>
    `,
    text: `Daily Beach Report for ${userName}. Today's top beaches and conditions. Visit ${process.env.NEXT_PUBLIC_APP_URL}/beaches for details.`
  }),

  upgrade: (tier: string, features: string[]) => ({
    subject: `🎉 Welcome to Beach Hui ${tier}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FDE047 0%, #F97316 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">You're Now ${tier}! 🏆</h1>
        </div>
        <div style="padding: 30px; background: #f7f7f7;">
          <h2 style="color: #333;">Your New Features:</h2>
          <ul style="color: #666; line-height: 2;">
            ${features.map(f => `<li>✅ ${f}</li>`).join('')}
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #F97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Explore Pro Features
            </a>
          </div>
        </div>
      </div>
    `,
    text: `Congratulations! You're now Beach Hui ${tier}. New features unlocked: ${features.join(', ')}`
  })
}

// Send email function
export async function sendEmail(template: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: template.from || 'Beach Hui <alerts@beachhui.com>',
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      replyTo: template.replyTo || 'support@beachhui.com',
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// Batch email sending for daily reports
export async function sendBatchEmails(emails: EmailTemplate[]) {
  const results = await Promise.all(emails.map(sendEmail))
  return results
}

// Schedule daily report
export async function sendDailyReports() {
  // This would be called by a cron job
  // Get all users with daily report preference
  // Generate and send reports
  console.log('Sending daily reports...')
}