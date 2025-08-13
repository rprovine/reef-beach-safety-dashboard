import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Beach, BeachDetailResponse, Island } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export function useBeaches(island?: Island, searchQuery?: string) {
  return useQuery({
    queryKey: ['beaches', island, searchQuery],
    queryFn: async () => {
      try {
        const params = new URLSearchParams()
        if (island) params.append('island', island)
        if (searchQuery) params.append('search', searchQuery)
        // Add cache-busting parameter
        params.append('t', Date.now().toString())
        
        const url = `/api/beaches?${params.toString()}`
        console.log('[useBeaches] Fetching:', url)
        
        // Use fetch with no-cache to ensure fresh data
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json() as Beach[]
        
        console.log('[useBeaches] Response:', data?.length, 'beaches')
        if (data && data[0]) {
          console.log('[useBeaches] First beach data:', {
            name: data[0].name,
            hasConditions: !!data[0].currentConditions,
            waveHeight: data[0].currentConditions?.waveHeightFt,
            windSpeed: data[0].currentConditions?.windMph,
            waterTemp: data[0].currentConditions?.waterTempF
          })
        }
        
        return data
      } catch (error) {
        console.error('[useBeaches] Error:', error)
        throw error
      }
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

export function useBeachDetail(slug: string) {
  console.log('[useBeachDetail] Hook called with slug:', slug)
  
  const result = useQuery({
    queryKey: ['beach', slug],
    queryFn: async () => {
      console.log('[useBeachDetail] Starting fetch for:', slug)
      
      try {
        console.log('[useBeachDetail] Fetching beach:', slug)
        
        // Try the comprehensive endpoint first using fetch
        const response = await fetch(`/api/beaches/${slug}/comprehensive`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        console.log('[useBeachDetail] API response:', data)
        
        // Transform the data to match BeachDetailResponse interface
        
        // Get current conditions from the beach conditions
        const conditions = data.conditions || {}
        const tides = conditions.tides || []
        
        // Extract ALL conditions from the comprehensive data
        const forecast = data.forecast || {}
        const currentConditions = conditions.lastReading || {}
        
        // Build complete response - simplified
        const transformedResponse = {
          beach: data.beach,
          currentConditions: {
            waveHeightFt: conditions.waveHeight || 2,
            windMph: conditions.windSpeed || 10,
            windDirection: 45,
            waterTempF: conditions.waterTemp || 75,
            tideFt: conditions.currentTide || 2,
            timestamp: new Date()
          },
          forecast7Day: [],
          history30Day: [],
          advisories: data.advisories || [],
          tides: [],
          safetyScore: conditions.safetyScore,
          activities: conditions.activities,
          bacteriaLevel: conditions.bacteriaLevel,
          warnings: data.warnings,
          recommendations: data.recommendations,
          trends: data.trends
        }
        
        console.log('[useBeachDetail] Transformed response:', transformedResponse)
        
        return transformedResponse as any
      } catch (error) {
        console.error('Beach detail error:', error)
        throw error
      }
    },
    enabled: !!slug,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  })
  
  console.log('[useBeachDetail] Query result:', {
    status: result.status,
    isLoading: result.isLoading,
    isError: result.isError,
    data: result.data
  })
  
  return result
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