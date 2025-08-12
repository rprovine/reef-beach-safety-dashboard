export const emailTemplates = {
  // Welcome email for new registrations
  welcomeWithTrial: (name: string, trialDays: number = 14) => ({
    subject: '🌊 Welcome to Beach Hui - Your 14-Day Pro Trial Starts Now!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Beach Hui! 🌺</h1>
          <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 16px;">Aloha ${name}!</p>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <div style="background: #10b981; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 20px;">🎉 Your 14-Day Pro Trial is Active!</h2>
            <p style="margin: 0; font-size: 16px;">Experience all Pro features FREE for ${trialDays} days</p>
          </div>
          
          <h3 style="color: #111827; font-size: 20px; margin-bottom: 20px;">What you can do with Pro:</h3>
          <ul style="color: #4b5563; line-height: 1.8; font-size: 15px;">
            <li>🏖️ Monitor unlimited beaches with real-time alerts</li>
            <li>📊 Access 7-day forecasts and historical trends</li>
            <li>📱 Get SMS and push notifications for critical alerts</li>
            <li>🤝 Post and view community reports</li>
            <li>🔌 API access for your own applications (100 calls/day)</li>
            <li>📥 Export data in CSV and JSON formats</li>
            <li>🤖 Unlimited AI Beach Buddy queries</li>
            <li>⚡ Priority email support</li>
          </ul>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h4 style="color: #111827; margin: 0 0 10px 0;">Quick Start:</h4>
            <ol style="color: #4b5563; line-height: 1.8; font-size: 14px; margin: 10px 0;">
              <li>Set up your first beach alert</li>
              <li>Check today's conditions at your favorite beaches</li>
              <li>Join the community discussions</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/dashboard" 
               style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
              Go to Your Dashboard →
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 40px;">
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6; text-align: center;">
              Your trial ends in ${trialDays} days. No credit card required during trial.<br>
              Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/help" style="color: #06b6d4;">help center</a>.
            </p>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © 2025 LeniLani Consulting | Beach Hui<br>
            Keeping Hawaii's beaches safe for everyone
          </p>
        </div>
      </div>
    `,
    text: `Aloha ${name}! Welcome to Beach Hui. Your 14-day Pro trial is now active! Access unlimited beaches, get SMS alerts, use our API, and more. Visit ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/dashboard to get started. Your trial ends in ${trialDays} days.`
  }),

  // Trial expiring reminder (3 days before)
  trialExpiring: (name: string, daysRemaining: number) => ({
    subject: `⏰ Your Beach Hui Pro Trial Expires in ${daysRemaining} Days`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Your Trial is Ending Soon</h1>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #111827; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-weight: 600;">
              ⏰ Your Pro trial expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}
            </p>
          </div>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Don't lose access to these Pro features:
          </p>
          
          <ul style="color: #4b5563; line-height: 1.8; font-size: 14px;">
            <li>Unlimited beach monitoring and alerts</li>
            <li>7-day forecasts and historical data</li>
            <li>SMS and push notifications</li>
            <li>API access for integrations</li>
            <li>Priority support</li>
          </ul>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px;">🎁 Special Offer</h3>
            <p style="color: #166534; margin: 0 0 15px 0;">Upgrade now and save 20% on your first year!</p>
            <p style="color: #166534; margin: 0; font-size: 20px; font-weight: bold;">
              Only $3.99/month (was $4.99) or $38.30/year (was $47.88)
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/checkout?plan=pro&billing=monthly&discount=TRIAL20" 
               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; margin-right: 10px;">
              Upgrade Now & Save 20%
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 20px;">
            After your trial ends, you'll automatically switch to our Free tier with limited features.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${name}, your Beach Hui Pro trial expires in ${daysRemaining} days. Upgrade now and save 20% on your first year! Visit ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/checkout to keep your Pro features.`
  }),

  // Trial expired
  trialExpired: (name: string) => ({
    subject: '📅 Your Beach Hui Pro Trial Has Ended',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Your Pro Trial Has Ended</h1>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #111827; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Your 14-day Pro trial has ended. You've been switched to our Free tier.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #111827; margin: 0 0 15px 0;">What you still have with Free:</h3>
            <ul style="color: #4b5563; line-height: 1.8; font-size: 14px; margin: 0;">
              <li>✅ Monitor up to 3 beaches</li>
              <li>✅ Current conditions and safety scores</li>
              <li>✅ Email notifications</li>
              <li>✅ Community access</li>
            </ul>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">What you're missing:</h3>
            <ul style="color: #92400e; line-height: 1.8; font-size: 14px; margin: 0;">
              <li>❌ Unlimited beach monitoring</li>
              <li>❌ 7-day forecasts</li>
              <li>❌ SMS alerts</li>
              <li>❌ API access</li>
              <li>❌ Data exports</li>
            </ul>
          </div>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="color: #166534; margin: 0 0 10px 0; font-weight: 600;">
              🎁 Come back anytime! Upgrade to Pro for just $4.99/month
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/pricing" 
               style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
              View Upgrade Options
            </a>
          </div>
        </div>
      </div>
    `,
    text: `Hi ${name}, your Beach Hui Pro trial has ended. You've been switched to the Free tier. Upgrade anytime for just $4.99/month to get back unlimited beaches, SMS alerts, and more. Visit ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/pricing`
  }),

  // Subscription confirmation
  subscriptionConfirmed: (name: string, plan: 'monthly' | 'yearly', amount: string) => ({
    subject: '✅ Payment Confirmed - Welcome to Beach Hui Pro!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Pro! 🎉</h1>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #111827; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px 20px; margin: 20px 0;">
            <p style="color: #166534; margin: 0; font-weight: 600;">
              ✅ Payment successful! Your Pro subscription is now active.
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #111827; margin: 0 0 15px 0;">Subscription Details:</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Plan:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">Beach Hui Pro (${plan})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Amount:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">${amount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Next billing:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">${plan === 'yearly' ? 'In 12 months' : 'In 30 days'}</td>
              </tr>
            </table>
          </div>
          
          <h3 style="color: #111827; margin: 30px 0 15px 0;">Your Pro Features:</h3>
          <ul style="color: #4b5563; line-height: 1.8; font-size: 14px;">
            <li>✅ Unlimited beach monitoring</li>
            <li>✅ 7-day forecasts & trends</li>
            <li>✅ SMS and push alerts</li>
            <li>✅ API access (100 calls/day)</li>
            <li>✅ Data exports</li>
            <li>✅ Priority support</li>
          </ul>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/account" 
               style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
              Manage Subscription
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; text-align: center;">
            You can cancel or modify your subscription anytime from your account settings.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${name}, payment confirmed! Your Beach Hui Pro subscription (${plan} - ${amount}) is now active. Enjoy unlimited beaches, SMS alerts, API access and more. Manage your subscription at ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/account`
  }),

  // Subscription canceled
  subscriptionCanceled: (name: string, endDate: string) => ({
    subject: '📋 Subscription Cancellation Confirmed',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Subscription Canceled</h1>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #111827; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            We've canceled your Beach Hui Pro subscription as requested.
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0;">
              <strong>Important:</strong> You'll keep Pro access until ${endDate}
            </p>
          </div>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            After ${endDate}, your account will switch to the Free tier with these features:
          </p>
          
          <ul style="color: #4b5563; line-height: 1.8; font-size: 14px;">
            <li>Monitor up to 3 beaches</li>
            <li>Current conditions only</li>
            <li>Email notifications</li>
            <li>Basic community access</li>
          </ul>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="color: #166534; margin: 0;">
              Changed your mind? You can reactivate your subscription anytime before ${endDate}
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/account" 
               style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
              Reactivate Subscription
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; text-align: center;">
            We'd love to hear your feedback. Reply to this email to let us know how we can improve.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${name}, your Beach Hui Pro subscription has been canceled. You'll keep Pro access until ${endDate}, then switch to Free tier. You can reactivate anytime at ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/account`
  }),

  // Password reset
  passwordReset: (name: string, resetLink: string) => ({
    subject: '🔐 Reset Your Beach Hui Password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #111827; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            We received a request to reset your Beach Hui password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
            This link will expire in 1 hour for security reasons.<br><br>
            If you didn't request this, you can safely ignore this email. Your password won't be changed.
          </p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 25px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              <strong>Having trouble?</strong><br>
              Copy and paste this link into your browser:<br>
              <span style="color: #06b6d4; word-break: break-all;">${resetLink}</span>
            </p>
          </div>
        </div>
      </div>
    `,
    text: `Hi ${name}, reset your Beach Hui password here: ${resetLink}. This link expires in 1 hour. If you didn't request this, ignore this email.`
  })
}