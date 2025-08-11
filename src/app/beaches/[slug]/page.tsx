import { Suspense } from 'react'
import BeachDetailContent from './beach-detail-content'

export default function BeachDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-500 mx-auto mb-4"></div>
          <p>Loading beach details...</p>
        </div>
      </div>
    }>
      <BeachDetailContent />
    </Suspense>
  )
}