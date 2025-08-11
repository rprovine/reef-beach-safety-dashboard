import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Beach, BeachDetailResponse, Island } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export function useBeaches(island?: Island, searchQuery?: string) {
  return useQuery({
    queryKey: ['beaches', island, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (island) params.append('island', island)
      if (searchQuery) params.append('search', searchQuery)
      
      const url = `/api/beaches?${params.toString()}`
      const response = await axios.get<Beach[]>(url)
      return response.data
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

export function useBeachDetail(slug: string) {
  return useQuery({
    queryKey: ['beach', slug],
    queryFn: async () => {
      try {
        // Try the comprehensive endpoint first
        const response = await axios.get<any>(
          `/api/beaches/${slug}/comprehensive`
        )
        
        // Transform the data to match BeachDetailResponse interface
        const data = response.data
        
        // Get current conditions from the beach conditions
        const conditions = data.conditions || {}
        const tides = conditions.tides || []
        
        // Extract ALL conditions from the comprehensive data
        const forecast = data.forecast || {}
        const currentConditions = conditions.lastReading || {}
        
        // Build complete response using all available data
        const response = {
          beach: {
            ...data.beach,
            currentStatus: data.beach.status || 'good',
            lastUpdated: data.sources?.lastUpdated || new Date().toISOString(),
            lat: data.beach.coordinates?.lat,
            lng: data.beach.coordinates?.lng
          },
          currentConditions: {
            waveHeightFt: conditions.waveHeight || currentConditions.waveHeightFt || forecast.next3Hours?.[0]?.waveHeight,
            windMph: conditions.windSpeed || currentConditions.windMph || forecast.next3Hours?.[0]?.windSpeed,
            windDirection: currentConditions.windDirDeg || 45,
            waterTempF: conditions.waterTemp || currentConditions.waterTempF,
            tideFt: conditions.currentTide || currentConditions.tideFt,
            timestamp: new Date(data.sources?.lastUpdated || Date.now())
          },
          forecast7Day: forecast.next24Hours || [],
          history30Day: [],
          advisories: data.advisories || [],
          tides: tides.slice(0, 4).map((t: any) => ({
            time: new Date(t.t),
            height: parseFloat(t.v),
            type: t.type === 'H' ? 'high' : 'low'
          })) || [],
          // Add additional data from API
          safetyScore: conditions.safetyScore,
          activities: conditions.activities,
          bacteriaLevel: conditions.bacteriaLevel,
          enterococcus: conditions.enterococcus,
          bestTimeToday: conditions.bestTimeToday,
          nextHighTide: conditions.nextHighTide,
          nextLowTide: conditions.nextLowTide,
          tidalRange: conditions.tidalRange,
          family: data.family,
          warnings: data.warnings,
          recommendations: data.recommendations,
          trends: data.trends
        }
        
        return response as any
      } catch (error) {
        console.error('Beach detail error:', error)
        throw error
      }
    },
    enabled: !!slug,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  })
}

export function useBeachHistory(slug: string, days: number = 30) {
  return useQuery({
    queryKey: ['beach-history', slug, days],
    queryFn: async () => {
      // For now, return mock history data
      // TODO: Implement proper history API endpoint
      return {
        waveHeights: [2.1, 2.3, 2.0, 1.8, 2.2, 2.4, 2.1],
        windSpeeds: [12, 15, 10, 8, 14, 16, 13],
        waterTemps: [79, 80, 78, 79, 80, 81, 79]
      }
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useBeachAlerts(beachId: number) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['beach-alerts', beachId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/api/v1/alerts?beach_id=${beachId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      )
      return response.data
    },
    enabled: !!beachId,
  })

  const createAlert = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await axios.post(
        `${API_URL}/api/v1/alerts`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beach-alerts', beachId] })
    },
  })

  return {
    ...query,
    createAlert,
  }
}