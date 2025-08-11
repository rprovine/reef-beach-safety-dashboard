const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌊 Starting seed...');
  
  // Create test beaches
  const beaches = [
    {
      name: 'Waikiki Beach',
      slug: 'waikiki-beach',
      island: 'oahu',
      lat: 21.2761,
      lng: -157.8267,
      spotType: 'family',
      description: 'Famous beach in Honolulu with calm waters perfect for beginners',
      amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food'],
      isActive: true
    },
    {
      name: 'Pipeline',
      slug: 'pipeline',
      island: 'oahu',
      lat: 21.6650,
      lng: -158.0533,
      spotType: 'surf',
      description: 'World-famous surf break on the North Shore',
      amenities: ['parking', 'restrooms', 'lifeguard'],
      isActive: true
    },
    {
      name: 'Lanikai Beach',
      slug: 'lanikai-beach',
      island: 'oahu',
      lat: 21.3929,
      lng: -157.7156,
      spotType: 'family',
      description: 'Pristine beach with turquoise waters and powdery sand',
      amenities: ['parking', 'kayak-rental'],
      isActive: true
    },
    {
      name: 'Sunset Beach',
      slug: 'sunset-beach',
      island: 'oahu',
      lat: 21.6795,
      lng: -158.0408,
      spotType: 'surf',
      description: 'North Shore beach known for big winter waves',
      amenities: ['parking', 'restrooms', 'showers', 'lifeguard'],
      isActive: true
    },
    {
      name: 'Hanauma Bay',
      slug: 'hanauma-bay',
      island: 'oahu',
      lat: 21.2690,
      lng: -157.6938,
      spotType: 'tidepool',
      description: 'Marine sanctuary perfect for snorkeling',
      amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food', 'equipment-rental'],
      isActive: true
    },
    {
      name: 'Big Beach',
      slug: 'big-beach',
      island: 'maui',
      lat: 20.6320,
      lng: -156.4482,
      spotType: 'general',
      description: 'Large beach in Makena with golden sand',
      amenities: ['parking', 'restrooms', 'lifeguard'],
      isActive: true
    },
    {
      name: 'Napili Bay',
      slug: 'napili-bay',
      island: 'maui',
      lat: 20.9942,
      lng: -156.6678,
      spotType: 'family',
      description: 'Calm bay perfect for swimming and snorkeling',
      amenities: ['parking', 'restrooms', 'food'],
      isActive: true
    },
    {
      name: 'Poipu Beach',
      slug: 'poipu-beach',
      island: 'kauai',
      lat: 21.8761,
      lng: -159.4477,
      spotType: 'family',
      description: 'Popular south shore beach with monk seals',
      amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food'],
      isActive: true
    },
    {
      name: 'Hanalei Bay',
      slug: 'hanalei-bay',
      island: 'kauai',
      lat: 22.2050,
      lng: -159.5014,
      spotType: 'general',
      description: 'Scenic crescent-shaped bay on the north shore',
      amenities: ['parking', 'restrooms', 'lifeguard'],
      isActive: true
    },
    {
      name: 'Hapuna Beach',
      slug: 'hapuna-beach',
      island: 'hawaii',
      lat: 19.9932,
      lng: -155.8247,
      spotType: 'family',
      description: 'Wide white sand beach on the Big Island',
      amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food'],
      isActive: true
    }
  ];
  
  console.log('📍 Creating beaches...');
  for (const beach of beaches) {
    await prisma.beach.upsert({
      where: { slug: beach.slug },
      update: beach,
      create: beach
    });
    console.log(`  ✅ ${beach.name} (${beach.island})`);
  }
  
  // Create test user
  console.log('\n👤 Creating test users...');
  
  const testUsers = [
    {
      email: 'free@test.com',
      password: 'password123',
      name: 'Free User',
      tier: 'free'
    },
    {
      email: 'consumer@test.com',
      password: 'password123',
      name: 'Consumer User',
      tier: 'consumer'
    },
    {
      email: 'business@test.com',
      password: 'password123',
      name: 'Business User',
      tier: 'business'
    }
  ];
  
  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        tier: userData.tier,
        subscriptionStatus: userData.tier === 'free' ? 'trial' : 'active',
        trialEndDate: userData.tier === 'free' 
          ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) 
          : null,
      }
    });
    
    // Create subscription
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        tier: userData.tier,
        status: 'active',
        billingCycle: 'monthly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    
    console.log(`  ✅ ${userData.name} (${userData.email} / password123)`);
  }
  
  // Add some sample readings for beaches
  console.log('\n🌊 Adding sample readings...');
  
  const waikiki = await prisma.beach.findUnique({ where: { slug: 'waikiki-beach' } });
  const pipeline = await prisma.beach.findUnique({ where: { slug: 'pipeline' } });
  
  if (waikiki) {
    await prisma.reading.create({
      data: {
        beachId: waikiki.id,
        source: 'noaa',
        waveHeightFt: 2.5,
        windMph: 12,
        windDirDeg: 45, // NE
        waterTempF: 78,
        tideFt: 1.2,
        bacteriaLevel: 'safe',
        timestamp: new Date()
      }
    });
    console.log('  ✅ Added conditions for Waikiki');
  }
  
  if (pipeline) {
    await prisma.reading.create({
      data: {
        beachId: pipeline.id,
        source: 'noaa',
        waveHeightFt: 8.0,
        windMph: 15,
        windDirDeg: 0, // N
        waterTempF: 76,
        tideFt: 2.1,
        bacteriaLevel: 'safe',
        timestamp: new Date()
      }
    });
    
    // Add a high surf advisory
    await prisma.advisory.create({
      data: {
        beachId: pipeline.id,
        status: 'active',
        title: 'High Surf Advisory',
        description: 'Waves 8-12 feet expected on north facing shores',
        severity: 'high',
        source: 'nws',
        startedAt: new Date()
      }
    });
    console.log('  ✅ Added conditions and advisory for Pipeline');
  }
  
  console.log('\n✨ Seed completed successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('  • free@test.com / password123 (Free tier)');
  console.log('  • consumer@test.com / password123 (Consumer tier)');
  console.log('  • business@test.com / password123 (Business tier)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });