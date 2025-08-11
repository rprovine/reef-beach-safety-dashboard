const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const beaches = [
  // Oahu Beaches
  {
    name: 'Waikiki Beach',
    slug: 'waikiki-beach',
    island: 'oahu',
    description: 'Famous beach in Honolulu with calm waters perfect for beginners',
    lat: 21.2765,
    lng: -157.8257,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food']
  },
  {
    name: 'Pipeline',
    slug: 'pipeline',
    island: 'oahu',
    description: 'World-famous surf break on the North Shore',
    lat: 21.6650,
    lng: -158.0531,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'lifeguard']
  },
  {
    name: 'Lanikai Beach',
    slug: 'lanikai-beach',
    island: 'oahu',
    description: 'Pristine beach with turquoise waters and powdery sand',
    lat: 21.3933,
    lng: -157.7147,
    spotType: 'family',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Sunset Beach',
    slug: 'sunset-beach',
    island: 'oahu',
    description: 'North Shore beach known for big winter waves',
    lat: 21.6794,
    lng: -158.0419,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Hanauma Bay',
    slug: 'hanauma-bay',
    island: 'oahu',
    description: 'Marine sanctuary perfect for snorkeling',
    lat: 21.2690,
    lng: -157.6938,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food']
  },
  {
    name: 'Sandy Beach',
    slug: 'sandy-beach',
    island: 'oahu',
    description: 'Popular body surfing beach with powerful shore break',
    lat: 21.2853,
    lng: -157.6699,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Ko Olina Lagoons',
    slug: 'ko-olina-lagoons',
    island: 'oahu',
    description: 'Four man-made lagoons with calm, protected waters',
    lat: 21.3389,
    lng: -158.1256,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Waimea Bay',
    slug: 'waimea-bay',
    island: 'oahu',
    description: 'Famous big wave surf spot and cliff jumping location',
    lat: 21.6403,
    lng: -158.0631,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Kailua Beach',
    slug: 'kailua-beach',
    island: 'oahu',
    description: 'Wide beach with soft sand and turquoise waters',
    lat: 21.3961,
    lng: -157.7350,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Makapuu Beach',
    slug: 'makapuu-beach',
    island: 'oahu',
    description: 'Body boarding beach with beautiful lighthouse views',
    lat: 21.3099,
    lng: -157.6581,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'lifeguard']
  },
  {
    name: 'Ala Moana Beach',
    slug: 'ala-moana-beach',
    island: 'oahu',
    description: 'Long sandy beach popular with locals',
    lat: 21.2897,
    lng: -157.8469,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'food']
  },
  {
    name: 'Diamond Head Beach',
    slug: 'diamond-head-beach',
    island: 'oahu',
    description: 'Secluded beach below Diamond Head crater',
    lat: 21.2553,
    lng: -157.8055,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Bellows Beach',
    slug: 'bellows-beach',
    island: 'oahu',
    description: 'Beautiful beach with ironwood trees, open weekends only',
    lat: 21.3561,
    lng: -157.7097,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Yokohama Bay',
    slug: 'yokohama-bay',
    island: 'oahu',
    description: 'Remote beach at the end of Farrington Highway',
    lat: 21.5531,
    lng: -158.2464,
    spotType: 'general',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Electric Beach',
    slug: 'electric-beach',
    island: 'oahu',
    description: 'Popular snorkeling spot near power plant',
    lat: 21.3572,
    lng: -158.1244,
    spotType: 'tidepool',
    amenities: ['parking']
  },

  // Maui Beaches
  {
    name: 'Big Beach',
    slug: 'big-beach',
    island: 'maui',
    description: 'Large beach in Makena with golden sand',
    lat: 20.6320,
    lng: -156.4495,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'lifeguard']
  },
  {
    name: 'Napili Bay',
    slug: 'napili-bay',
    island: 'maui',
    description: 'Calm bay perfect for swimming and snorkeling',
    lat: 20.9944,
    lng: -156.6678,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Kaanapali Beach',
    slug: 'kaanapali-beach',
    island: 'maui',
    description: 'Three-mile stretch of white sand beach',
    lat: 20.9306,
    lng: -156.6950,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'food']
  },
  {
    name: 'Wailea Beach',
    slug: 'wailea-beach',
    island: 'maui',
    description: 'Upscale resort beach with golden sand',
    lat: 20.6833,
    lng: -156.4431,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'food']
  },
  {
    name: 'Hamoa Beach',
    slug: 'hamoa-beach',
    island: 'maui',
    description: 'Remote beach on the Road to Hana',
    lat: 20.7089,
    lng: -155.9906,
    spotType: 'general',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Honolua Bay',
    slug: 'honolua-bay',
    island: 'maui',
    description: 'Marine preserve excellent for snorkeling',
    lat: 21.0131,
    lng: -156.6381,
    spotType: 'tidepool',
    amenities: ['parking']
  },
  {
    name: 'Little Beach',
    slug: 'little-beach',
    island: 'maui',
    description: 'Small beach north of Big Beach',
    lat: 20.6347,
    lng: -156.4475,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Kapalua Bay',
    slug: 'kapalua-bay',
    island: 'maui',
    description: 'Sheltered crescent beach ideal for families',
    lat: 20.9989,
    lng: -156.6672,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Hookipa Beach',
    slug: 'hookipa-beach',
    island: 'maui',
    description: 'World-renowned windsurfing destination',
    lat: 20.9333,
    lng: -156.3583,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Baldwin Beach',
    slug: 'baldwin-beach',
    island: 'maui',
    description: 'Long sandy beach popular with locals',
    lat: 20.9144,
    lng: -156.3683,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Lahaina Beach',
    slug: 'lahaina-beach',
    island: 'maui',
    description: 'Beach in historic Lahaina town',
    lat: 20.8722,
    lng: -156.6764,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'food']
  },
  {
    name: 'DT Fleming Beach',
    slug: 'dt-fleming-beach',
    island: 'maui',
    description: 'Wide beach at Kapalua',
    lat: 21.0053,
    lng: -156.6519,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Ulua Beach',
    slug: 'ulua-beach',
    island: 'maui',
    description: 'Small beach in Wailea great for snorkeling',
    lat: 20.6928,
    lng: -156.4444,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Mokapu Beach',
    slug: 'mokapu-beach',
    island: 'maui',
    description: 'Beautiful beach in Wailea',
    lat: 20.6889,
    lng: -156.4433,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Keawakapu Beach',
    slug: 'keawakapu-beach',
    island: 'maui',
    description: 'Long beach between Wailea and Kihei',
    lat: 20.7022,
    lng: -156.4467,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },

  // Kauai Beaches
  {
    name: 'Poipu Beach',
    slug: 'poipu-beach',
    island: 'kauai',
    description: 'Popular south shore beach with monk seals',
    lat: 21.8744,
    lng: -159.4567,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food']
  },
  {
    name: 'Hanalei Bay',
    slug: 'hanalei-bay',
    island: 'kauai',
    description: 'Scenic crescent-shaped bay on the north shore',
    lat: 22.2050,
    lng: -159.5012,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Tunnels Beach',
    slug: 'tunnels-beach',
    island: 'kauai',
    description: 'Excellent snorkeling spot with underwater caves',
    lat: 22.2242,
    lng: -159.5786,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Kee Beach',
    slug: 'kee-beach',
    island: 'kauai',
    description: 'Beach at the end of the road on North Shore',
    lat: 22.2267,
    lng: -159.5825,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Anini Beach',
    slug: 'anini-beach',
    island: 'kauai',
    description: 'Protected beach with long coral reef',
    lat: 22.2122,
    lng: -159.4464,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Lydgate Beach',
    slug: 'lydgate-beach',
    island: 'kauai',
    description: 'Family-friendly beach with protected swimming areas',
    lat: 22.0458,
    lng: -159.3347,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Shipwreck Beach',
    slug: 'shipwreck-beach',
    island: 'kauai',
    description: 'Beach known for powerful waves and cliff jumping',
    lat: 21.8697,
    lng: -159.4253,
    spotType: 'surf',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Secret Beach',
    slug: 'secret-beach',
    island: 'kauai',
    description: 'Secluded beach accessed by steep trail',
    lat: 22.2200,
    lng: -159.4083,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Polihale Beach',
    slug: 'polihale-beach',
    island: 'kauai',
    description: 'Longest beach in Hawaii at 17 miles',
    lat: 22.0831,
    lng: -159.7625,
    spotType: 'general',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Salt Pond Beach',
    slug: 'salt-pond-beach',
    island: 'kauai',
    description: 'Protected beach with traditional salt ponds',
    lat: 21.9069,
    lng: -159.6181,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Brenneckes Beach',
    slug: 'brenneckes-beach',
    island: 'kauai',
    description: 'Popular bodysurfing beach next to Poipu',
    lat: 21.8722,
    lng: -159.4539,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'food']
  },
  {
    name: 'Lawai Beach',
    slug: 'lawai-beach',
    island: 'kauai',
    description: 'Small beach known as Beach House Beach',
    lat: 21.8772,
    lng: -159.4636,
    spotType: 'tidepool',
    amenities: ['parking', 'food']
  },
  {
    name: 'Baby Beach',
    slug: 'baby-beach',
    island: 'kauai',
    description: 'Shallow protected beach perfect for young children',
    lat: 21.8833,
    lng: -159.4681,
    spotType: 'family',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Glass Beach',
    slug: 'glass-beach',
    island: 'kauai',
    description: 'Beach with sea glass near Port Allen',
    lat: 21.9022,
    lng: -159.5978,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Donkey Beach',
    slug: 'donkey-beach',
    island: 'kauai',
    description: 'Secluded beach on the east coast',
    lat: 22.1428,
    lng: -159.3247,
    spotType: 'general',
    amenities: ['parking']
  },

  // Big Island (Hawaii) Beaches
  {
    name: 'Hapuna Beach',
    slug: 'hapuna-beach',
    island: 'hawaii',
    description: 'Wide white sand beach on the Big Island',
    lat: 19.9933,
    lng: -155.8228,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard', 'food']
  },
  {
    name: 'Punaluu Black Sand Beach',
    slug: 'punaluu-black-sand-beach',
    island: 'hawaii',
    description: 'Famous black sand beach with sea turtles',
    lat: 19.1356,
    lng: -155.5050,
    spotType: 'general',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Green Sand Beach',
    slug: 'green-sand-beach',
    island: 'hawaii',
    description: 'Rare green sand beach at Papakolea',
    lat: 18.9364,
    lng: -155.6467,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Mauna Kea Beach',
    slug: 'mauna-kea-beach',
    island: 'hawaii',
    description: 'Crescent-shaped white sand beach',
    lat: 20.0069,
    lng: -155.8250,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'food']
  },
  {
    name: 'Kealakekua Bay',
    slug: 'kealakekua-bay',
    island: 'hawaii',
    description: 'Historic bay with excellent snorkeling',
    lat: 19.4811,
    lng: -155.9206,
    spotType: 'tidepool',
    amenities: ['parking']
  },
  {
    name: 'Honokohau Beach',
    slug: 'honokohau-beach',
    island: 'hawaii',
    description: 'Beach with ancient Hawaiian fishponds',
    lat: 19.6750,
    lng: -156.0250,
    spotType: 'general',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Magic Sands Beach',
    slug: 'magic-sands-beach',
    island: 'hawaii',
    description: 'Beach where sand disappears during high surf',
    lat: 19.5994,
    lng: -155.9717,
    spotType: 'surf',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Maniniowali Beach',
    slug: 'maniniowali-beach',
    island: 'hawaii',
    description: 'Also known as Kua Bay, pristine white sand',
    lat: 19.8033,
    lng: -155.9978,
    spotType: 'family',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Richardson Beach',
    slug: 'richardson-beach',
    island: 'hawaii',
    description: 'Black sand beach with tide pools',
    lat: 19.7317,
    lng: -155.0186,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Carlsmith Beach',
    slug: 'carlsmith-beach',
    island: 'hawaii',
    description: 'Lagoon-style beach park in Hilo',
    lat: 19.7350,
    lng: -155.0169,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Waialea Beach',
    slug: 'waialea-beach',
    island: 'hawaii',
    description: 'Also known as Beach 69',
    lat: 20.0044,
    lng: -155.8300,
    spotType: 'family',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Spencer Beach',
    slug: 'spencer-beach',
    island: 'hawaii',
    description: 'Protected beach perfect for families',
    lat: 20.0244,
    lng: -155.8275,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers', 'lifeguard']
  },
  {
    name: 'Kehena Beach',
    slug: 'kehena-beach',
    island: 'hawaii',
    description: 'Black sand beach popular with dolphins',
    lat: 19.3439,
    lng: -154.9469,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Pohoiki Beach',
    slug: 'pohoiki-beach',
    island: 'hawaii',
    description: 'New black sand beach formed by 2018 lava flow',
    lat: 19.4600,
    lng: -154.8433,
    spotType: 'general',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Laupahoehoe Point',
    slug: 'laupahoehoe-point',
    island: 'hawaii',
    description: 'Dramatic rocky coastline with tide pools',
    lat: 19.9889,
    lng: -155.2361,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms']
  },

  // Molokai Beaches
  {
    name: 'Papohaku Beach',
    slug: 'papohaku-beach',
    island: 'molokai',
    description: 'Three-mile long beach, one of Hawaii\'s longest',
    lat: 21.1861,
    lng: -157.2458,
    spotType: 'general',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Kapukahehu Beach',
    slug: 'kapukahehu-beach',
    island: 'molokai',
    description: 'Also known as Dixie Maru Beach',
    lat: 21.1847,
    lng: -157.2183,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Murphy Beach',
    slug: 'murphy-beach',
    island: 'molokai',
    description: 'Secluded beach on the east end',
    lat: 21.0617,
    lng: -156.7078,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Halawa Beach',
    slug: 'halawa-beach',
    island: 'molokai',
    description: 'Beach at the end of scenic Halawa Valley',
    lat: 21.1547,
    lng: -156.7336,
    spotType: 'general',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'One Alii Beach',
    slug: 'one-alii-beach',
    island: 'molokai',
    description: 'Beach park with protected swimming area',
    lat: 21.0883,
    lng: -157.0033,
    spotType: 'family',
    amenities: ['parking', 'restrooms', 'showers']
  },

  // Lanai Beaches
  {
    name: 'Shipwreck Beach Lanai',
    slug: 'shipwreck-beach-lanai',
    island: 'lanai',
    description: 'Eight-mile stretch with offshore shipwrecks',
    lat: 20.9161,
    lng: -156.9019,
    spotType: 'general',
    amenities: ['parking']
  },
  {
    name: 'Hulopoe Beach',
    slug: 'hulopoe-beach',
    island: 'lanai',
    description: 'Marine preserve with tide pools',
    lat: 20.7419,
    lng: -156.9925,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms', 'showers']
  },
  {
    name: 'Polihua Beach',
    slug: 'polihua-beach',
    island: 'lanai',
    description: 'Remote and wild beach on the north shore',
    lat: 20.9500,
    lng: -156.9833,
    spotType: 'general',
    amenities: []
  },
  {
    name: 'Manele Bay',
    slug: 'manele-bay',
    island: 'lanai',
    description: 'Small harbor beach with good snorkeling',
    lat: 20.7383,
    lng: -156.9867,
    spotType: 'tidepool',
    amenities: ['parking', 'restrooms']
  },
  {
    name: 'Lopa Beach',
    slug: 'lopa-beach',
    island: 'lanai',
    description: 'Remote beach on the east coast',
    lat: 20.7644,
    lng: -156.8933,
    spotType: 'general',
    amenities: []
  }
]

async function main() {
  console.log('Seeding beaches...')
  
  // Clear existing beaches
  await prisma.beach.deleteMany()
  
  // Create beaches
  for (const beach of beaches) {
    await prisma.beach.create({
      data: beach
    })
    console.log(`Created beach: ${beach.name}`)
  }
  
  console.log(`Successfully seeded ${beaches.length} beaches`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })