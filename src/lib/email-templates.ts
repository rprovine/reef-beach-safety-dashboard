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
          
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #86efac; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 16px;">📅 How Your Trial Works:</h3>
            <ol style="color: #15803d; line-height: 1.8; font-size: 14px; margin: 0; padding-left: 20px;">
              <li><strong>Days 1-14:</strong> You have <span style="background: #bbf7d0; padding: 2px 6px; border-radius: 4px;">FULL Pro access</span> - all features unlocked!</li>
              <li><strong>Day 11:</strong> We'll send you a reminder email</li>
              <li><strong>Day 14:</strong> Last day to upgrade for $4.99/mo to keep Pro features</li>
              <li><strong>Day 15+:</strong> <span style="background: #fed7aa; padding: 2px 6px; border-radius: 4px; color: #9a3412;">Automatically becomes Free tier</span> if not upgraded</li>
            </ol>
            <p style="color: #166534; font-size: 12px; margin: 12px 0 0 0; font-style: italic;">
              💡 <strong>No surprises:</strong> You'll always have free access with basic features, even after trial ends!
            </p>
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
              <strong>Your trial ends in ${trialDays} days.</strong> After that, you'll automatically switch to Free tier (limited features) unless you upgrade.<br>
              No credit card required during trial • No surprise charges<br>
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
    text: `Aloha ${name}! Welcome to Beach Hui. Your 14-day Pro trial is now active! You have FULL Pro access for 14 days, then automatically switch to Free tier (limited features) unless you upgrade for $4.99/mo. Visit ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/dashboard to get started.`
  }),

  // Trial halfway reminder (Day 7 - 7 days left)
  trialHalfway: (name: string, daysRemaining: number) => ({
    subject: '🌊 You\'re halfway through your Beach Hui Pro Trial!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Enjoying Beach Hui Pro? 🏖️</h1>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #111827; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          
          <div style="background: #f0f9ff; border-left: 4px solid #06b6d4; padding: 15px 20px; margin: 20px 0;">
            <p style="color: #075985; margin: 0; font-weight: 600;">
              You're halfway through your 14-day Pro trial! (${daysRemaining} days remaining)
            </p>
          </div>
          
          <h3 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">How's your experience so far?</h3>
          
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            We hope you're loving these Pro features:
          </p>
          
          <ul style="color: #4b5563; line-height: 1.8; font-size: 14px;">
            <li>✅ Unlimited beach monitoring across all Hawaiian islands</li>
            <li>✅ Real-time SMS alerts for critical conditions</li>
            <li>✅ 7-day forecasts to plan your beach visits</li>
            <li>✅ API access for your own applications</li>
            <li>✅ Priority support when you need help</li>
          </ul>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">💡 Pro Tip</h3>
            <p style="color: #166534; margin: 0; font-size: 14px;">
              Have you tried setting up custom alerts for your favorite beaches? 
              Go to your dashboard and click "Add Alert" to get notified when conditions are perfect!
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
              Keep Pro features after your trial!
            </p>
            <p style="color: #92400e; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">
              Just $4.99/month
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/pricing" 
               style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 15px;">
              View Upgrade Options
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 20px;">
            No pressure! You still have ${daysRemaining} days to explore all Pro features.<br>
            Your trial will automatically convert to our Free tier if you don't upgrade.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${name}, you're halfway through your Beach Hui Pro trial with ${daysRemaining} days remaining. Enjoying unlimited beaches, SMS alerts, and forecasts? Keep them for just $4.99/month. Visit ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/pricing to view options.`
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

  // Trial last chance reminder (1 day before expiration)
  trialLastChance: (name: string) => ({
    subject: '🚨 LAST CHANCE: Your Beach Hui Pro Trial Expires Tomorrow!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Trial Expires Tomorrow!</h1>
        </div>
        <div style="padding: 40px 30px; background: white; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #111827; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px 20px; margin: 20px 0;">
            <p style="color: #991b1b; margin: 0; font-weight: 600; font-size: 18px;">
              ⚠️ Your Pro trial expires in less than 24 hours!
            </p>
          </div>
          
          <h3 style="color: #111827; font-size: 18px; margin: 25px 0 15px 0;">Tomorrow, you'll lose access to:</h3>
          
          <ul style="color: #dc2626; line-height: 1.8; font-size: 14px; font-weight: 500;">
            <li>❌ Unlimited beach monitoring (limited to 3 beaches)</li>
            <li>❌ SMS and push notifications</li>
            <li>❌ 7-day forecasts and historical trends</li>
            <li>❌ API access for integrations</li>
            <li>❌ Data exports and priority support</li>
            <li>❌ Unlimited AI Beach Buddy queries</li>
          </ul>
          
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <h2 style="color: white; margin: 0 0 10px 0; font-size: 24px;">
              🎁 EXCLUSIVE: Save 40% Today Only!
            </h2>
            <p style="color: white; margin: 0 0 15px 0; font-size: 18px;">
              Upgrade now for just <span style="font-size: 28px; font-weight: bold;">$2.99/month</span>
            </p>
            <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0; font-size: 14px;">
              (Regular price: $4.99/month - Save $24/year!)
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/checkout?plan=pro&billing=monthly&discount=LASTCHANCE40" 
               style="background: white; color: #059669; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              🔒 Lock In 40% Discount Forever
            </a>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 12px;">
              This special rate is only available until midnight tonight
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #111827; margin: 0 0 10px 0;">What happens if I don't upgrade?</h4>
            <p style="color: #4b5563; font-size: 14px; margin: 0;">
              Tomorrow at midnight, your account automatically switches to our Free tier. 
              You'll still have access to Beach Hui, but with limited features (3 beaches max, 
              no SMS alerts, current conditions only).
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/checkout?plan=pro&billing=monthly&discount=LASTCHANCE40" 
               style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">
              Claim Your 40% Discount Now
            </a>
            <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">
              Or choose annual billing for even more savings:<br>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/checkout?plan=pro&billing=yearly&discount=LASTCHANCE40" 
                 style="color: #06b6d4; text-decoration: underline;">
                Get 12 months for $28.68 (Save $31.20!)
              </a>
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            Don't want to lose your Pro features? This is your last chance to lock in our best price.<br>
            <strong>Offer expires at midnight tonight!</strong>
          </p>
        </div>
      </div>
    `,
    text: `Hi ${name}, URGENT: Your Beach Hui Pro trial expires tomorrow! You'll lose unlimited beaches, SMS alerts, forecasts, and more. Last chance offer: Get 40% OFF - just $2.99/month (reg $4.99). Visit ${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/checkout?discount=LASTCHANCE40 before midnight!`
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