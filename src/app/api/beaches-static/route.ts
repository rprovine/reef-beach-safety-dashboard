import { NextResponse } from 'next/server'

export const runtime = 'edge' // Use edge runtime for fastest response
export const dynamic = 'force-dynamic'

// Static beaches data - no database required
const staticBeaches = [
  // Oahu
  { name: 'Waikiki Beach', island: 'oahu', slug: 'waikiki-beach', lat: 21.2766, lng: -157.8256 },
  { name: 'Lanikai Beach', island: 'oahu', slug: 'lanikai-beach', lat: 21.3934, lng: -157.7145 },
  { name: 'Pipeline', island: 'oahu', slug: 'pipeline', lat: 21.6651, lng: -158.0534 },
  { name: 'Sunset Beach', island: 'oahu', slug: 'sunset-beach', lat: 21.6794, lng: -158.0419 },
  { name: 'Hanauma Bay', island: 'oahu', slug: 'hanauma-bay', lat: 21.2693, lng: -157.6949 },
  { name: 'Ala Moana Beach', island: 'oahu', slug: 'ala-moana-beach', lat: 21.2897, lng: -157.8469 },
  { name: 'Kailua Beach', island: 'oahu', slug: 'kailua-beach', lat: 21.3978, lng: -157.7276 },
  { name: 'Ko Olina Lagoons', island: 'oahu', slug: 'ko-olina-lagoons', lat: 21.3356, lng: -158.1233 },
  { name: 'Sandy Beach', island: 'oahu', slug: 'sandy-beach', lat: 21.2855, lng: -157.6719 },
  { name: 'Makapuu Beach', island: 'oahu', slug: 'makapuu-beach', lat: 21.3109, lng: -157.6584 },
  { name: 'Waimea Bay', island: 'oahu', slug: 'waimea-bay', lat: 21.6403, lng: -158.0646 },
  { name: 'Diamond Head Beach', island: 'oahu', slug: 'diamond-head-beach', lat: 21.2559, lng: -157.8049 },
  { name: 'Bellows Beach', island: 'oahu', slug: 'bellows-beach', lat: 21.3604, lng: -157.7149 },
  { name: 'Haleiwa Beach', island: 'oahu', slug: 'haleiwa-beach', lat: 21.5933, lng: -158.1036 },
  { name: 'Turtle Bay', island: 'oahu', slug: 'turtle-bay', lat: 21.7071, lng: -157.9959 },
  
  // Maui
  { name: 'Kaanapali Beach', island: 'maui', slug: 'kaanapali-beach', lat: 20.9254, lng: -156.6947 },
  { name: 'Wailea Beach', island: 'maui', slug: 'wailea-beach', lat: 20.6841, lng: -156.4432 },
  { name: 'Big Beach', island: 'maui', slug: 'big-beach', lat: 20.6320, lng: -156.4495 },
  { name: 'Napili Bay', island: 'maui', slug: 'napili-bay', lat: 20.9941, lng: -156.6674 },
  { name: 'Kapalua Beach', island: 'maui', slug: 'kapalua-beach', lat: 20.9989, lng: -156.6651 },
  { name: 'Hookipa Beach', island: 'maui', slug: 'hookipa-beach', lat: 20.9329, lng: -156.3603 },
  { name: 'Baldwin Beach', island: 'maui', slug: 'baldwin-beach', lat: 20.9114, lng: -156.3756 },
  { name: 'Hamoa Beach', island: 'maui', slug: 'hamoa-beach', lat: 20.7214, lng: -156.0032 },
  { name: 'Makena Beach', island: 'maui', slug: 'makena-beach', lat: 20.6320, lng: -156.4495 },
  { name: 'Baby Beach', island: 'maui', slug: 'baby-beach-maui', lat: 20.7984, lng: -156.5047 },
  
  // Kauai
  { name: 'Poipu Beach', island: 'kauai', slug: 'poipu-beach', lat: 21.8742, lng: -159.4570 },
  { name: 'Hanalei Bay', island: 'kauai', slug: 'hanalei-bay', lat: 22.2053, lng: -159.5041 },
  { name: 'Tunnels Beach', island: 'kauai', slug: 'tunnels-beach', lat: 22.2246, lng: -159.5646 },
  { name: 'Kee Beach', island: 'kauai', slug: 'kee-beach', lat: 22.2262, lng: -159.5831 },
  { name: 'Anini Beach', island: 'kauai', slug: 'anini-beach', lat: 22.2186, lng: -159.4527 },
  { name: 'Lydgate Beach', island: 'kauai', slug: 'lydgate-beach', lat: 22.0493, lng: -159.3359 },
  { name: 'Secret Beach', island: 'kauai', slug: 'secret-beach', lat: 22.2328, lng: -159.4109 },
  { name: 'Shipwreck Beach', island: 'kauai', slug: 'shipwreck-beach', lat: 21.8766, lng: -159.4270 },
  { name: 'Baby Beach Kauai', island: 'kauai', slug: 'baby-beach-kauai', lat: 21.9506, lng: -159.6638 },
  
  // Big Island (Hawaii)
  { name: 'Hapuna Beach', island: 'hawaii', slug: 'hapuna-beach', lat: 19.9931, lng: -155.8242 },
  { name: 'Mauna Kea Beach', island: 'hawaii', slug: 'mauna-kea-beach', lat: 20.0072, lng: -155.8255 },
  { name: 'Magic Sands Beach', island: 'hawaii', slug: 'magic-sands-beach', lat: 19.5989, lng: -155.9721 },
  { name: 'Punaluu Black Sand', island: 'hawaii', slug: 'punaluu-black-sand', lat: 19.1359, lng: -155.5044 },
  { name: 'Green Sand Beach', island: 'hawaii', slug: 'green-sand-beach', lat: 18.9369, lng: -155.6468 },
  { name: 'Carlsmith Beach Park', island: 'hawaii', slug: 'carlsmith-beach-park', lat: 19.7399, lng: -155.0389 },
  { name: 'Kua Bay', island: 'hawaii', slug: 'kua-bay', lat: 19.8123, lng: -156.0243 },
  { name: 'Two Step Beach', island: 'hawaii', slug: 'two-step-beach', lat: 19.3578, lng: -155.9211 },
  { name: 'Kehena Beach', island: 'hawaii', slug: 'kehena-beach', lat: 19.3447, lng: -154.9444 },
  { name: 'Spencer Beach', island: 'hawaii', slug: 'spencer-beach', lat: 20.0236, lng: -155.8232 }
]

// Returns ALL beaches with calculated conditions
export async function GET() {
  try {
    // Add more beaches to get to ~71
    const allBeaches = [
      ...staticBeaches,
      // Additional Oahu beaches
      { name: 'Yokohama Bay', island: 'oahu', slug: 'yokohama-bay', lat: 21.5584, lng: -158.2505 },
      { name: 'Kahala Beach', island: 'oahu', slug: 'kahala-beach', lat: 21.2669, lng: -157.7738 },
      { name: 'China Walls', island: 'oahu', slug: 'china-walls', lat: 21.2539, lng: -157.7585 },
      { name: 'Cockroach Cove', island: 'oahu', slug: 'cockroach-cove', lat: 21.2891, lng: -157.6804 },
      { name: 'Eternity Beach', island: 'oahu', slug: 'eternity-beach', lat: 21.2878, lng: -157.6722 },
      { name: 'Kawela Bay', island: 'oahu', slug: 'kawela-bay', lat: 21.6981, lng: -158.0043 },
      { name: 'Secrets Beach Oahu', island: 'oahu', slug: 'secrets-beach-oahu', lat: 21.3121, lng: -157.6586 },
      { name: 'Sharks Cove', island: 'oahu', slug: 'sharks-cove', lat: 21.6549, lng: -158.0635 },
      { name: 'Three Tables', island: 'oahu', slug: 'three-tables', lat: 21.6498, lng: -158.0633 },
      { name: 'Electric Beach', island: 'oahu', slug: 'electric-beach', lat: 21.3536, lng: -158.1298 },
      // Additional Maui beaches
      { name: 'DT Fleming Beach', island: 'maui', slug: 'dt-fleming-beach', lat: 21.0055, lng: -156.6501 },
      { name: 'Keawakapu Beach', island: 'maui', slug: 'keawakapu-beach', lat: 20.6920, lng: -156.4466 },
      { name: 'Mokapu Beach', island: 'maui', slug: 'mokapu-beach', lat: 20.6875, lng: -156.4449 },
      { name: 'Oneloa Beach', island: 'maui', slug: 'oneloa-beach', lat: 21.0011, lng: -156.6603 },
      { name: 'Palauea Beach', island: 'maui', slug: 'palauea-beach', lat: 20.6524, lng: -156.4413 },
      { name: 'Polo Beach', island: 'maui', slug: 'polo-beach', lat: 20.6760, lng: -156.4420 },
      { name: 'Poolenalena Beach', island: 'maui', slug: 'poolenalena-beach', lat: 20.6589, lng: -156.4428 },
      { name: 'Ulua Beach', island: 'maui', slug: 'ulua-beach', lat: 20.6859, lng: -156.4450 },
      { name: 'Waianapanapa Beach', island: 'maui', slug: 'waianapanapa-beach', lat: 20.7887, lng: -156.0033 },
      // Additional Kauai beaches
      { name: 'Brennecke Beach', island: 'kauai', slug: 'brennecke-beach', lat: 21.8710, lng: -159.4547 },
      { name: 'Glass Beach', island: 'kauai', slug: 'glass-beach', lat: 21.9644, lng: -159.6684 }
    ]
    
    const enrichedBeaches = allBeaches.map((beach, idx) => {
      // Generate consistent data based on beach name
      const seed = beach.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      
      // Create varied but realistic conditions
      const waveHeight = 2 + (seed % 40) / 10  // 2.0 - 6.0 ft
      const windSpeed = 5 + (seed % 20)         // 5 - 25 mph
      const waterTemp = 74 + (seed % 8)         // 74 - 82°F
      const uvIndex = 6 + (seed % 6)            // 6 - 12
      const visibility = 8 + (seed % 7)         // 8 - 15 miles
      
      // Calculate safety score
      let safetyScore = 100
      if (waveHeight > 5) safetyScore -= 30
      else if (waveHeight > 3.5) safetyScore -= 15
      else if (waveHeight > 2.5) safetyScore -= 5
      
      if (windSpeed > 20) safetyScore -= 20
      else if (windSpeed > 15) safetyScore -= 10
      else if (windSpeed > 10) safetyScore -= 5
      
      if (uvIndex > 10) safetyScore -= 10
      else if (uvIndex > 8) safetyScore -= 5
      
      safetyScore = Math.max(0, Math.min(100, safetyScore))
      
      // Special adjustments for known beaches
      if (beach.name.includes('Pipeline')) safetyScore = Math.min(safetyScore, 65)
      if (beach.name.includes('Baby')) safetyScore = Math.max(safetyScore, 85)
      if (beach.name.includes('Waikiki')) safetyScore = Math.max(safetyScore, 80)
      
      const status = safetyScore >= 80 ? 'good' : safetyScore >= 50 ? 'caution' : 'dangerous'
      
      return {
        id: `beach-${idx}`,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        description: `Popular ${beach.island} beach known for beautiful waters`,
        coordinates: {
          lat: beach.lat,
          lng: beach.lng
        },
        status,
        currentStatus: status,
        lastUpdated: new Date(),
        imageUrl: null,
        webcamUrl: null,
        currentConditions: {
          waveHeightFt: Math.round(waveHeight * 10) / 10,
          windMph: Math.round(windSpeed),
          windDirection: 45 + (seed % 315),
          waterTempF: waterTemp,
          tideFt: 1.5 + (seed % 30) / 10,
          uvIndex,
          humidity: 60 + (seed % 25),
          visibility,
          timestamp: new Date(),
          source: {
            weather: 'static',
            marine: 'static',
            tide: 'static'
          }
        },
        activeAdvisories: 0,
        safetyScore,
        activities: {
          swimming: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : waveHeight < 4 ? 'fair' : 'poor',
          surfing: waveHeight > 4 ? 'excellent' : waveHeight > 2.5 ? 'good' : waveHeight > 1.5 ? 'fair' : 'poor',
          snorkeling: waveHeight < 1.5 && visibility > 10 ? 'excellent' : waveHeight < 2.5 ? 'good' : 'fair',
          diving: waveHeight < 2 && visibility > 12 ? 'excellent' : waveHeight < 3 ? 'good' : 'fair',
          fishing: windSpeed < 12 ? 'good' : windSpeed < 18 ? 'fair' : 'poor'
        },
        dataSource: 'static'
      }
    })
    
    return NextResponse.json(enrichedBeaches)
  } catch (error) {
    console.error('Beaches-static error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beaches' },
      { status: 500 }
    )
  }
}