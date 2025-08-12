'use client'

import { Beach } from '@/types'
import { BeachCard } from './beach-card'
import { RestrictedBeachCard } from './restricted-beach-card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { getUserAccessLevel } from '@/lib/access-control'

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
  const { user, isPro } = useAuth()
  const access = getUserAccessLevel(user)

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
      {beaches.map((beach) => {
        // Show restricted card for anonymous users or free users without full access
        if (!user || (!isPro && !access.beaches.viewCurrentConditions)) {
          return (
            <RestrictedBeachCard
              key={beach.id}
              beach={beach}
              onClick={() => handleBeachClick(beach)}
            />
          )
        }
        
        // Show full card for authenticated users with access
        return (
          <BeachCard
            key={beach.id}
            beach={beach}
            selected={selectedBeachId === beach.slug}
            onClick={() => handleBeachClick(beach)}
          />
        )
      })}
    </div>
  )
}