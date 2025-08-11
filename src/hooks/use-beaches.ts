import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Beach, BeachDetailResponse, Island } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

export function useBeaches(island?: Island, searchQuery?: string) {
  console.log('useBeaches: Hook called with', { island, searchQuery })
  return useQuery({
    queryKey: ['beaches', island, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (island) params.append('island', island)
      if (searchQuery) params.append('search', searchQuery)
      
      const url = `/api/beaches?${params.toString()}`
      console.log('useBeaches: Fetching from', url)
      
      try {
        const response = await axios.get<Beach[]>(url)
        console.log('useBeaches: Success', response.data.length, 'beaches')
        return response.data
      } catch (error) {
        console.error('useBeaches: Error', error)
        throw error
      }
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

export function useBeachDetail(slug: string) {
  return useQuery({
    queryKey: ['beach', slug],
    queryFn: async () => {
      const response = await axios.get<BeachDetailResponse>(
        `/api/beaches/${slug}/comprehensive`
      )
      return response.data
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