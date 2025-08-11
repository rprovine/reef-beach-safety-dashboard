'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { 
  Waves, Wind, Thermometer, AlertTriangle, Clock, 
  MapPin, ArrowLeft, Bell, Sun, Droplets, Eye,
  Activity, Users, MessageSquare, Heart,
  Shield, Fish, Info, Navigation
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

interface BeachDetailContentProps {
  slug: string
}

export default function BeachDetailContent({ slug }: BeachDetailContentProps) {
  const [beachData, setBeachData] = useState<Record<string, unknown> | null>(null)
  const [communityReports, setCommunityReports] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBeachData = useCallback(async () => {
    try {
      const response = await fetch(`/api/beaches/${slug}/comprehensive`)
      if (!response.ok) throw new Error('Failed to fetch beach data')
      const data = await response.json()
      setBeachData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load beach data')
    } finally {
      setLoading(false)
    }
  }, [slug])

  const fetchCommunityReports = useCallback(async () => {
    try {
      // Get beach ID first
      const beachRes = await fetch(`/api/beaches?search=${slug}`)
      const beaches = await beachRes.json()
      const beach = beaches.find((b: Record<string, unknown>) => b.slug === slug)
      
      if (beach) {
        const response = await fetch(`/api/community/reports?beachId=${beach.id}`)
        const data = await response.json()
        setCommunityReports(data.reports || [])
      }
    } catch (err) {
      console.error('Failed to fetch community reports:', err)
    }
  }, [slug])

  useEffect(() => {
    fetchBeachData()
    fetchCommunityReports()
  }, [fetchBeachData, fetchCommunityReports])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading real-time beach data...</p>
        </div>
      </div>
    )
  }

  if (error || !beachData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Beach</h1>
          <p className="text-gray-600 mb-4">{error || 'Beach not found'}</p>
          <Link href="/beaches">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to beaches
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const { beach, conditions, warnings, forecast, recommendations, sources } = beachData as {
    beach: Record<string, unknown>,
    conditions: Record<string, unknown>,
    warnings: string[],
    forecast: Record<string, unknown>,
    recommendations: string[],
    sources: Record<string, unknown>
  }

  // Determine overall safety level
  const getSafetyLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500' }
    if (score >= 60) return { label: 'Good', color: 'bg-blue-500' }
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-500' }
    if (score >= 20) return { label: 'Poor', color: 'bg-orange-500' }
    return { label: 'Dangerous', color: 'bg-red-500' }
  }

  const safety = getSafetyLevel((conditions?.safetyScore as number) || 50)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/beaches">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{beach.name as string}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {(beach.island as string).charAt(0).toUpperCase() + (beach.island as string).slice(1)}
                  </div>
                  <Badge className={safety.color}>
                    <Shield className="h-3 w-3 mr-1" />
                    {safety.label} Conditions
                  </Badge>
                  <Badge variant="outline">
                    Score: {conditions.safetyScore}/100
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Set Alert
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Active Warnings</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1">
                  {warnings.map((warning: string, idx: number) => (
                    <li key={idx}>• {warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Conditions Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Conditions</CardTitle>
                <CardDescription>
                  Data from {Object.entries(sources).filter(([k, v]) => v === 'active' && k !== 'lastUpdated').map(([k]) => k).join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ocean" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="ocean">Ocean</TabsTrigger>
                    <TabsTrigger value="weather">Weather</TabsTrigger>
                    <TabsTrigger value="safety">Safety</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ocean" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        icon={Waves}
                        label="Wave Height"
                        value={conditions.waveHeight?.toFixed(1)}
                        unit="ft"
                        subValue={`Period: ${conditions.wavePeriod?.toFixed(1)}s`}
                      />
                      <MetricCard
                        icon={Activity}
                        label="Swell"
                        value={conditions.swellHeight?.toFixed(1)}
                        unit="ft"
                        subValue={`Direction: ${conditions.swellDirection || 'N/A'}`}
                      />
                      <MetricCard
                        icon={Thermometer}
                        label="Water Temp"
                        value={conditions.waterTemp ? (conditions.waterTemp * 9/5 + 32).toFixed(0) : null}
                        unit="°F"
                        subValue="Perfect for swimming"
                      />
                      <MetricCard
                        icon={Navigation}
                        label="Current"
                        value={conditions.currentSpeed?.toFixed(1)}
                        unit="kts"
                        subValue={`Risk: ${conditions.ripCurrentRisk || 'Low'}`}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="weather" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        icon={Wind}
                        label="Wind Speed"
                        value={conditions.windSpeed?.toFixed(1)}
                        unit="mph"
                        subValue={`Direction: ${conditions.windDirection || 'N/A'}`}
                      />
                      <MetricCard
                        icon={Sun}
                        label="UV Index"
                        value={conditions.uvIndex}
                        unit=""
                        subValue={conditions.uvIndex > 8 ? 'Use SPF 50+' : 'Moderate'}
                      />
                      <MetricCard
                        icon={Thermometer}
                        label="Air Temp"
                        value={conditions.airTemp?.toFixed(0)}
                        unit="°F"
                        subValue={`Humidity: ${conditions.humidity?.toFixed(0)}%`}
                      />
                      <MetricCard
                        icon={Eye}
                        label="Visibility"
                        value={conditions.visibility ? (conditions.visibility / 1000).toFixed(1) : null}
                        unit="mi"
                        subValue="Clear conditions"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="safety" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        icon={Shield}
                        label="Safety Score"
                        value={conditions.safetyScore}
                        unit="/100"
                        subValue={safety.label}
                      />
                      <MetricCard
                        icon={Droplets}
                        label="Water Quality"
                        value={conditions.bacteriaLevel || 'Safe'}
                        unit=""
                        subValue={`E. coli: ${conditions.enterococcus?.toFixed(0) || 'Low'} CFU`}
                      />
                      <MetricCard
                        icon={Activity}
                        label="Rip Current"
                        value={conditions.ripCurrentRisk || 'Low'}
                        unit=""
                        subValue="Stay near lifeguards"
                      />
                      <MetricCard
                        icon={Eye}
                        label="Water Clarity"
                        value={conditions.waterClarity}
                        unit="ft"
                        subValue="Visibility underwater"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activities" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(conditions.activities || {}).map(([activity, rating]) => (
                        <ActivityRating
                          key={activity}
                          activity={activity}
                          rating={rating as string}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Community Reports */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Community Reports</CardTitle>
                    <CardDescription>Real-time updates from beachgoers</CardDescription>
                  </div>
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {communityReports.length > 0 ? (
                  <div className="space-y-4">
                    {communityReports.map((report) => (
                      <div key={report.id} className="border-l-4 border-ocean-500 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{report.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant={report.severity === 'high' ? 'destructive' : 'secondary'}>
                                {report.reportType}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(report.createdAt).toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500">
                                by {report.user?.name || 'Anonymous'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              👍 {report.upvotes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent reports. Be the first to share conditions!</p>
                )}
              </CardContent>
            </Card>

            {/* Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Forecast</CardTitle>
                <CardDescription>Conditions for the next 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecast?.next3Hours?.map((period: Record<string, unknown>, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-sm font-medium">
                        {new Date(period.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm">
                          <Waves className="h-3 w-3 mr-1 text-gray-400" />
                          {period.waveHeight?.toFixed(1)} ft
                        </div>
                        <div className="flex items-center text-sm">
                          <Wind className="h-3 w-3 mr-1 text-gray-400" />
                          {period.windSpeed?.toFixed(0)} mph
                        </div>
                        <div className="flex items-center text-sm">
                          <Activity className="h-3 w-3 mr-1 text-gray-400" />
                          {period.tide?.toFixed(1)} ft
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Best Time to Visit */}
            <Card>
              <CardHeader>
                <CardTitle>Best Time Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-ocean-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{conditions.bestTimeToday}</p>
                  <p className="text-sm text-gray-600 mt-2">Based on tide, crowd, and conditions</p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <Info className="h-4 w-4 text-ocean-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Beach Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <Badge variant="outline">{beach.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amenities</span>
                    <span className="text-sm font-medium">{beach.amenities?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coordinates</span>
                    <span className="text-sm font-mono">
                      {beach.coordinates.lat.toFixed(4)}, {beach.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Last updated: {new Date(sources.lastUpdated).toLocaleTimeString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(sources).filter(([k]) => k !== 'lastUpdated').map(([source, status]) => (
                    <div key={source} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{source}</span>
                      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                        {status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  unit: string
  subValue?: string
}

function MetricCard({ icon: Icon, label, value, unit, subValue }: MetricCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-ocean-500" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold">
        {value !== null && value !== undefined ? `${value}${unit}` : '--'}
      </div>
      {subValue && (
        <div className="text-xs text-gray-600 mt-1">{subValue}</div>
      )}
    </div>
  )
}

function ActivityRating({ activity, rating }: { activity: string; rating: string }) {
  const getColor = (rating: string) => {
    switch(rating) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-blue-600 bg-blue-50'
      case 'fair': return 'text-yellow-600 bg-yellow-50'
      case 'poor': return 'text-orange-600 bg-orange-50'
      case 'dangerous': return 'text-red-600 bg-red-50'
      case 'flat': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getIcon = (activity: string) => {
    switch(activity) {
      case 'swimming': return Users
      case 'surfing': return Waves
      case 'snorkeling': return Fish
      case 'diving': return Fish
      case 'fishing': return Fish
      default: return Activity
    }
  }

  const IconComponent = getIcon(activity)

  return (
    <div className={`rounded-lg p-4 ${getColor(rating)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <IconComponent className="h-5 w-5 mr-2" />
          <span className="font-medium capitalize">{activity}</span>
        </div>
        <Badge className={getColor(rating).replace('bg-', 'bg-opacity-20 ')}>
          {rating.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}