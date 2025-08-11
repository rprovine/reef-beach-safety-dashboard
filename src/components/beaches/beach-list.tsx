'use client'

import { Beach } from '@/types'
import { BeachCard } from './beach-card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BeachListProps {
  beaches?: Beach[]
  loading: boolean
  error: Error | null
  selectedBeachId: string | null
  onBeachSelect: (beachId: string) => void
  compact?: boolean
}

export function BeachList({
  beaches,
  loading,
  error,
  selectedBeachId,
  onBeachSelect,
  compact = false,
}: BeachListProps) {
  const router = useRouter()

  const handleBeachClick = (beach: Beach) => {
    router.push(`/beaches/${beach.slug}`)
  }

  // Render beach list
  
  if (loading) {
    return (
      <div className={compact ? 'p-4 space-y-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Beaches</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    )
  }

  if (!beaches || beaches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600">No beaches found</p>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="p-4 space-y-3">
        {beaches.map((beach) => (
          <BeachCard
            key={beach.id}
            beach={beach}
            selected={selectedBeachId === beach.slug}
            onClick={() => handleBeachClick(beach)}
            compact
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {beaches.map((beach) => (
        <BeachCard
          key={beach.id}
          beach={beach}
          selected={selectedBeachId === beach.slug}
          onClick={() => handleBeachClick(beach)}
        />
      ))}
    </div>
  )
}