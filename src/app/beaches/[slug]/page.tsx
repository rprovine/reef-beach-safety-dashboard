'use client'

import BeachDetailContent from './beach-detail-content'
import { ErrorBoundary } from '@/components/error-boundary'

export default function BeachDetailPage() {
  return (
    <ErrorBoundary>
      <BeachDetailContent />
    </ErrorBoundary>
  )
}