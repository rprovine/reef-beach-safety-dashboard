const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌊 Creating demo users...')

  // Create demo users for each tier
  const demoUsers = [
    {
      email: 'free@demo.com',
      password: 'demo123',
      name: 'Free User',
      tier: 'free',
      subscriptionStatus: 'active'
    },
    {
      email: 'consumer@demo.com', 
      password: 'demo123',
      name: 'Consumer User',
      tier: 'consumer',
      subscriptionStatus: 'active',
      trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
      email: 'business@demo.com',
      password: 'demo123', 
      name: 'Business User',
      tier: 'business',
      subscriptionStatus: 'active'
    },
    {
      email: 'enterprise@demo.com',
      password: 'demo123',
      name: 'Enterprise User', 
      tier: 'enterprise',
      subscriptionStatus: 'active'
    }
  ]

  for (const userData of demoUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        tier: userData.tier,
        subscriptionStatus: userData.subscriptionStatus,
        trialEndDate: userData.trialEndDate
      },
      create: {
        ...userData,
        password: hashedPassword
      }
    })

    // Create subscription record
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        tier: userData.tier,
        status: 'active',
        billingCycle: userData.tier === 'free' ? 'monthly' : 'yearly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      create: {
        userId: user.id,
        tier: userData.tier,
        status: 'active',
        billingCycle: userData.tier === 'free' ? 'monthly' : 'yearly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    })

    console.log(`✅ Created ${userData.tier} demo user: ${userData.email}`)
  }

  // Create some sample alerts for premium users
  const consumerUser = await prisma.user.findUnique({
    where: { email: 'consumer@demo.com' }
  })

  if (consumerUser) {
    const alert = await prisma.alert.create({
      data: {
        userId: consumerUser.id,
        name: 'Waikiki Surf Alert',
        isActive: true,
        channels: ['email'],
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
        timezone: 'Pacific/Honolulu',
        rules: {
          create: {
            beachId: 'cme6tu1pg0000s3oifhgipmw0', // Waikiki Beach
            metric: 'wave_height_ft',
            operator: 'gte',
            threshold: 4.0
          }
        }
      }
    })
    console.log(`✅ Created sample alert for consumer user`)
  }

  // Create a sample widget for business user
  const businessUser = await prisma.user.findUnique({
    where: { email: 'business@demo.com' }
  })

  if (businessUser) {
    await prisma.widget.create({
      data: {
        userId: businessUser.id,
        name: 'Hotel Website Widget',
        beaches: ['cme6tu1pg0000s3oifhgipmw0', 'cme6tu1pg0001s3oifhgipmw1'],
        theme: {
          accent: '#0EA5E9',
          font: 'Inter'
        },
        layout: 'card',
        domains: ['hotel-demo.com', 'localhost:3000']
      }
    })
    console.log(`✅ Created sample widget for business user`)
  }

  console.log('✅ Demo users created successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })