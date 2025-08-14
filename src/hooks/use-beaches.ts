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
        
        const url = `/api/beaches?${params.toString()}`
        console.log('[useBeaches] Fetching:', url)
        
        // Use fetch with aggressive cache-busting to ensure fresh data
        const response = await fetch(url + '&_t=' + Date.now() + '&_r=' + Math.random(), {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json() as Beach[]
        
        console.log('DEPLOYMENT-V4 useBeaches Response:', data?.length, 'beaches')
        if (data && data[0]) {
          console.log('DEPLOYMENT-V4 First beach name:', data[0].name)
          console.log('DEPLOYMENT-V4 First beach waveHeight:', data[0].currentConditions?.waveHeightFt)
          console.log('DEPLOYMENT-V4 First beach windSpeed:', data[0].currentConditions?.windMph)
          
          // Log first 3 beaches to check for variation
          if (data.length >= 3) {
            console.log('DEPLOYMENT-V4 Beach 1 waves:', data[0].currentConditions?.waveHeightFt)
            console.log('DEPLOYMENT-V4 Beach 2 waves:', data[1].currentConditions?.waveHeightFt)  
            console.log('DEPLOYMENT-V4 Beach 3 waves:', data[2].currentConditions?.waveHeightFt)
          }
        }
        
        return data
      } catch (error) {
        console.error('[useBeaches] Error:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch
    refetchOnWindowFocus: false, // Disable refetch on focus
    retry: 1 // Limit retries
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
        
        // Try the comprehensive endpoint first using fetch with cache-busting
        const response = await fetch(`/api/beaches/${slug}/comprehensive?_t=${Date.now()}&_r=${Math.random()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
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
        
        // Build complete response - NO FALLBACK DATA (user explicitly requested no mock data)
        const transformedResponse = {
          beach: data.beach,
          currentConditions: {
            waveHeightFt: conditions.waveHeight || conditions.waveHeightFt || null,
            windMph: conditions.windSpeed || conditions.windMph || null,
            windDirection: conditions.windDirection || null,
            waterTempF: conditions.waterTemp || conditions.waterTempF || null,
            tideFt: conditions.currentTide || conditions.tideFt || null,
            timestamp: conditions.timestamp || new Date()
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
      // Return null - no mock data
      // Historical data requires Pro subscription
      return null
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