import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Leaflet
export const BeachMap = dynamic(
  () => import('./beach-map').then((mod) => mod.BeachMap),
  {
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    ),
    ssr: false,
  }
)