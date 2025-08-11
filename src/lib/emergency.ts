// Emergency response and location sharing system for Hawaii beaches

export interface EmergencyContact {
  id: string
  type: 'police' | 'fire' | 'medical' | 'lifeguard' | 'coast_guard' | 'marine_patrol'
  name: string
  phone: string
  location?: string
  island?: 'oahu' | 'maui' | 'kauai' | 'hawaii'
  coordinates?: {
    lat: number
    lng: number
  }
  available24x7: boolean
}

export interface EmergencyAlert {
  id: string
  type: 'medical' | 'drowning' | 'marine_life' | 'lost_person' | 'equipment_failure' | 'weather'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  location: {
    beachSlug: string
    beachName: string
    coordinates: {
      lat: number
      lng: number
    }
    landmark?: string
  }
  reportedBy: {
    name?: string
    phone?: string
    email?: string
  }
  timestamp: Date
  responders?: string[]
  status: 'reported' | 'acknowledged' | 'responding' | 'resolved'
}

export interface LocationShare {
  id: string
  userId?: string
  beachSlug: string
  coordinates: {
    lat: number
    lng: number
    accuracy?: number
  }
  message?: string
  contactInfo?: {
    name: string
    phone: string
  }
  expiryTime: Date
  shareCode: string
  isActive: boolean
}

export interface EmergencyKit {
  location: string
  contents: {
    firstAid: boolean
    aed: boolean // Automated External Defibrillator
    spinalBoard: boolean
    oxygenKit: boolean
    emergencyRadio: boolean
    signalFlares: boolean
  }
  lastInspected: Date
  coordinates: {
    lat: number
    lng: number
  }
}

class EmergencyService {
  private contacts: EmergencyContact[] = []
  private activeAlerts: EmergencyAlert[] = []
  private locationShares: Map<string, LocationShare> = new Map()
  private emergencyKits: EmergencyKit[] = []

  constructor() {
    this.initializeHawaiiEmergencyContacts()
    this.initializeEmergencyKits()
  }

  // Get emergency contacts for specific island
  getEmergencyContacts(island?: string): EmergencyContact[] {
    if (!island) return this.contacts
    return this.contacts.filter(contact => !contact.island || contact.island === island)
  }

  // Report emergency
  reportEmergency(alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>): string {
    const emergencyAlert: EmergencyAlert = {
      id: `emergency-${Date.now()}`,
      timestamp: new Date(),
      status: 'reported',
      ...alert
    }

    this.activeAlerts.push(emergencyAlert)
    
    // Auto-notify appropriate responders
    this.notifyResponders(emergencyAlert)
    
    return emergencyAlert.id
  }

  // Share location with emergency code
  shareLocation(share: Omit<LocationShare, 'id' | 'shareCode' | 'isActive'>): string {
    const shareCode = this.generateShareCode()
    const locationShare: LocationShare = {
      id: `share-${Date.now()}`,
      shareCode,
      isActive: true,
      ...share
    }

    this.locationShares.set(shareCode, locationShare)
    
    // Auto-expire after specified time
    setTimeout(() => {
      const share = this.locationShares.get(shareCode)
      if (share) {
        share.isActive = false
      }
    }, share.expiryTime.getTime() - Date.now())

    return shareCode
  }

  // Get shared location by code
  getSharedLocation(shareCode: string): LocationShare | null {
    const share = this.locationShares.get(shareCode)
    if (!share || !share.isActive || new Date() > share.expiryTime) {
      return null
    }
    return share
  }

  // Get nearest emergency kit
  getNearestEmergencyKit(coordinates: { lat: number; lng: number }): EmergencyKit | null {
    if (this.emergencyKits.length === 0) return null

    let nearest = this.emergencyKits[0]
    let minDistance = this.calculateDistance(coordinates, nearest.coordinates)

    for (const kit of this.emergencyKits) {
      const distance = this.calculateDistance(coordinates, kit.coordinates)
      if (distance < minDistance) {
        minDistance = distance
        nearest = kit
      }
    }

    return nearest
  }

  // Get emergency action plan for situation
  getEmergencyActionPlan(type: EmergencyAlert['type']): {
    immediateActions: string[]
    contacts: EmergencyContact[]
    equipment?: string[]
  } {
    switch (type) {
      case 'drowning':
        return {
          immediateActions: [
            '1. Call 911 immediately',
            '2. Alert lifeguard if present',
            '3. Do not enter water unless you are a trained rescuer',
            '4. Throw flotation device if available',
            '5. Begin CPR if trained and victim is unresponsive',
            '6. Clear airway and check for breathing'
          ],
          contacts: this.contacts.filter(c => 
            c.type === 'lifeguard' || c.type === 'medical' || c.type === 'coast_guard'
          ),
          equipment: ['AED', 'First Aid Kit', 'Oxygen Kit', 'Spinal Board']
        }

      case 'marine_life':
        return {
          immediateActions: [
            '1. Remove victim from water safely',
            '2. For jellyfish stings: Remove tentacles with tweezers, rinse with vinegar',
            '3. For shark attack: Apply direct pressure to wounds, elevate injured limb',
            '4. Call 911 for severe injuries',
            '5. Monitor for signs of shock',
            '6. Do not use fresh water on jellyfish stings'
          ],
          contacts: this.contacts.filter(c => 
            c.type === 'medical' || c.type === 'marine_patrol'
          ),
          equipment: ['First Aid Kit', 'Vinegar', 'Pressure bandages']
        }

      case 'medical':
        return {
          immediateActions: [
            '1. Call 911',
            '2. Assess patient consciousness and breathing',
            '3. Control bleeding with direct pressure',
            '4. Do not move patient unless in immediate danger',
            '5. Monitor vital signs',
            '6. Prepare for EMS arrival'
          ],
          contacts: this.contacts.filter(c => 
            c.type === 'medical' || c.type === 'fire'
          ),
          equipment: ['AED', 'First Aid Kit', 'Oxygen Kit', 'Spinal Board']
        }

      case 'lost_person':
        return {
          immediateActions: [
            '1. Note last known location and time',
            '2. Contact beach lifeguards',
            '3. Call local police',
            '4. Organize search with other beachgoers',
            '5. Check with nearby beaches and facilities',
            '6. Contact Coast Guard if person may be in water'
          ],
          contacts: this.contacts.filter(c => 
            c.type === 'police' || c.type === 'coast_guard' || c.type === 'lifeguard'
          )
        }

      case 'weather':
        return {
          immediateActions: [
            '1. Move to higher ground if tsunami warning',
            '2. Seek shelter from lightning',
            '3. Exit water immediately',
            '4. Monitor emergency radio/alerts',
            '5. Follow evacuation orders',
            '6. Stay away from power lines and debris'
          ],
          contacts: this.contacts.filter(c => 
            c.type === 'police' || c.type === 'fire'
          )
        }

      default:
        return {
          immediateActions: [
            '1. Assess the situation',
            '2. Call 911 if life-threatening',
            '3. Move to safe location if needed',
            '4. Wait for emergency responders'
          ],
          contacts: this.contacts.filter(c => c.available24x7)
        }
    }
  }

  // Generate What3Words-style location code
  generateLocationCode(lat: number, lng: number): string {
    const words = [
      'beach', 'wave', 'sand', 'coral', 'palm', 'turtle', 'fish', 'sun', 'moon', 'star',
      'wind', 'rain', 'cloud', 'tide', 'shell', 'rock', 'cliff', 'bay', 'shore', 'reef'
    ]
    
    // Use coordinates to generate consistent word combination
    const latIndex = Math.floor(Math.abs(lat * 1000) % words.length)
    const lngIndex = Math.floor(Math.abs(lng * 1000) % words.length)
    const combinedIndex = Math.floor(Math.abs((lat + lng) * 1000) % words.length)
    
    return `${words[latIndex]}.${words[lngIndex]}.${words[combinedIndex]}`
  }

  private initializeHawaiiEmergencyContacts(): void {
    this.contacts = [
      // State-wide
      {
        id: 'hawaii-911',
        type: 'police',
        name: 'Emergency Services',
        phone: '911',
        available24x7: true
      },
      {
        id: 'poison-control',
        type: 'medical',
        name: 'Poison Control Center',
        phone: '1-800-222-1222',
        available24x7: true
      },

      // Oahu
      {
        id: 'hfd-oahu',
        type: 'fire',
        name: 'Honolulu Fire Department',
        phone: '911',
        island: 'oahu',
        available24x7: true
      },
      {
        id: 'ocean-safety-oahu',
        type: 'lifeguard',
        name: 'Oahu Ocean Safety',
        phone: '(808) 922-3888',
        island: 'oahu',
        available24x7: true
      },
      {
        id: 'queens-medical',
        type: 'medical',
        name: 'Queens Medical Center',
        phone: '(808) 538-9011',
        island: 'oahu',
        location: '1301 Punchbowl St, Honolulu',
        coordinates: { lat: 21.3099, lng: -157.8581 },
        available24x7: true
      },

      // Maui
      {
        id: 'mfd',
        type: 'fire',
        name: 'Maui Fire Department',
        phone: '911',
        island: 'maui',
        available24x7: true
      },
      {
        id: 'ocean-safety-maui',
        type: 'lifeguard',
        name: 'Maui Ocean Safety',
        phone: '(808) 270-7840',
        island: 'maui',
        available24x7: true
      },
      {
        id: 'maui-memorial',
        type: 'medical',
        name: 'Maui Memorial Medical Center',
        phone: '(808) 244-9056',
        island: 'maui',
        location: '221 Mahalani St, Wailuku',
        coordinates: { lat: 20.8947, lng: -156.4958 },
        available24x7: true
      },

      // Kauai
      {
        id: 'kfd',
        type: 'fire',
        name: 'Kauai Fire Department',
        phone: '911',
        island: 'kauai',
        available24x7: true
      },
      {
        id: 'ocean-safety-kauai',
        type: 'lifeguard',
        name: 'Kauai Ocean Safety',
        phone: '(808) 241-4984',
        island: 'kauai',
        available24x7: true
      },

      // Big Island
      {
        id: 'hawaii-fd',
        type: 'fire',
        name: 'Hawaii Fire Department',
        phone: '911',
        island: 'hawaii',
        available24x7: true
      },
      {
        id: 'ocean-safety-hawaii',
        type: 'lifeguard',
        name: 'Hawaii County Ocean Safety',
        phone: '(808) 961-8411',
        island: 'hawaii',
        available24x7: true
      },

      // Coast Guard
      {
        id: 'uscg-honolulu',
        type: 'coast_guard',
        name: 'US Coast Guard Sector Honolulu',
        phone: '(808) 842-2600',
        location: 'Sand Island, Honolulu',
        coordinates: { lat: 21.3318, lng: -157.8786 },
        available24x7: true
      },

      // Marine Life Emergency
      {
        id: 'noaa-marine',
        type: 'marine_patrol',
        name: 'NOAA Marine Life Emergency',
        phone: '1-888-256-9840',
        available24x7: true
      }
    ]
  }

  private initializeEmergencyKits(): void {
    this.emergencyKits = [
      {
        location: 'Waikiki Beach Lifeguard Station',
        contents: {
          firstAid: true,
          aed: true,
          spinalBoard: true,
          oxygenKit: true,
          emergencyRadio: true,
          signalFlares: false
        },
        lastInspected: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        coordinates: { lat: 21.2766, lng: -157.8237 }
      },
      {
        location: 'Hanauma Bay Information Kiosk',
        contents: {
          firstAid: true,
          aed: true,
          spinalBoard: false,
          oxygenKit: false,
          emergencyRadio: true,
          signalFlares: false
        },
        lastInspected: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        coordinates: { lat: 21.2693, lng: -157.6946 }
      }
    ]
  }

  private notifyResponders(alert: EmergencyAlert): void {
    // In production, this would send notifications to appropriate emergency services
    console.log(`Emergency alert ${alert.id} reported:`, alert)
    
    // Log to emergency services dispatch system
    const actionPlan = this.getEmergencyActionPlan(alert.type)
    console.log('Recommended contacts:', actionPlan.contacts.map(c => c.name))
  }

  private generateShareCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat)
    const dLng = this.toRadians(coord2.lng - coord1.lng)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

// Export singleton instance
export const emergencyService = new EmergencyService()