import { Suspense } from 'react'
import BeachesContent from './beaches-content'

export default function BeachesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading beaches...</div>}>
      <BeachesContent />
    </Suspense>
  )
}