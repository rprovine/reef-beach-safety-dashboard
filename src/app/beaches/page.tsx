import dynamic from 'next/dynamic'

const BeachesContent = dynamic(() => import('./beaches-content'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading beaches...</div>
})

export default function BeachesPage() {
  return <BeachesContent />
}