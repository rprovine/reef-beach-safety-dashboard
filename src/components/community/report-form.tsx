'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Send, 
  Star,
  Waves,
  Wind,
  Sun,
  Thermometer
} from 'lucide-react'

export interface CommunityReport {
  id?: string
  beachSlug: string
  beachName: string
  reportType: 'condition' | 'safety' | 'wildlife' | 'facility' | 'other'
  title: string
  description: string
  severity: 'low' | 'moderate' | 'high'
  conditions?: {
    waveHeight?: number
    windSpeed?: number
    waterTemp?: number
    crowdLevel?: 'empty' | 'light' | 'moderate' | 'crowded' | 'packed'
    waterClarity?: 'excellent' | 'good' | 'fair' | 'poor'
    beachCleanliness?: 1 | 2 | 3 | 4 | 5
  }
  photos?: File[]
  location?: {
    lat: number
    lng: number
  }
  reporterName?: string
  reporterEmail?: string
  timestamp: Date
}

interface ReportFormProps {
  beachSlug: string
  beachName: string
  onSubmit: (report: CommunityReport) => void
  onCancel: () => void
}

export function CommunityReportForm({ beachSlug, beachName, onSubmit, onCancel }: ReportFormProps) {
  const [formData, setFormData] = useState<Partial<CommunityReport>>({
    beachSlug,
    beachName,
    reportType: 'condition',
    severity: 'low',
    conditions: {
      crowdLevel: 'moderate',
      waterClarity: 'good',
      beachCleanliness: 4
    },
    timestamp: new Date()
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const reportTypes = [
    { value: 'condition', label: 'Beach Conditions', icon: Waves },
    { value: 'safety', label: 'Safety Issue', icon: AlertTriangle },
    { value: 'wildlife', label: 'Wildlife Sighting', icon: '🐢' },
    { value: 'facility', label: 'Facilities Issue', icon: MapPin },
    { value: 'other', label: 'Other', icon: '📝' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const report: CommunityReport = {
        ...formData,
        id: `report-${Date.now()}`,
        photos,
        timestamp: new Date()
      } as CommunityReport

      await onSubmit(report)
    } catch (error) {
      console.error('Failed to submit report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Report Beach Conditions</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Beach Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">{beachName}</span>
          </div>
        </div>

        {/* Report Type */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            What are you reporting?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {reportTypes.map((type) => (
              <label key={type.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="reportType"
                  value={type.value}
                  checked={formData.reportType === type.value}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.reportType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {typeof type.icon === 'string' ? (
                      <span className="text-lg">{type.icon}</span>
                    ) : (
                      <type.icon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Brief Title
          </Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., High surf conditions, Sea turtle sighting"
            className="mt-1"
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Details
          </Label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide more details about what you observed..."
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Conditions (if condition report) */}
        {formData.reportType === 'condition' && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-4">Current Conditions</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Wave Height */}
              <div>
                <Label className="text-sm text-gray-700 flex items-center gap-1">
                  <Waves className="h-4 w-4" />
                  Wave Height (ft)
                </Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={formData.conditions?.waveHeight || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, waveHeight: parseFloat(e.target.value) || undefined }
                  })}
                  placeholder="2.5"
                  className="mt-1"
                />
              </div>

              {/* Wind Speed */}
              <div>
                <Label className="text-sm text-gray-700 flex items-center gap-1">
                  <Wind className="h-4 w-4" />
                  Wind Speed (mph)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={formData.conditions?.windSpeed || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, windSpeed: parseFloat(e.target.value) || undefined }
                  })}
                  placeholder="10"
                  className="mt-1"
                />
              </div>

              {/* Water Temperature */}
              <div>
                <Label className="text-sm text-gray-700 flex items-center gap-1">
                  <Thermometer className="h-4 w-4" />
                  Water Temp (°F)
                </Label>
                <Input
                  type="number"
                  min="60"
                  max="90"
                  value={formData.conditions?.waterTemp || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, waterTemp: parseFloat(e.target.value) || undefined }
                  })}
                  placeholder="80"
                  className="mt-1"
                />
              </div>

              {/* Crowd Level */}
              <div>
                <Label className="text-sm text-gray-700">Crowd Level</Label>
                <select
                  value={formData.conditions?.crowdLevel || 'moderate'}
                  onChange={(e) => setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, crowdLevel: e.target.value as any }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="empty">Empty</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="crowded">Crowded</option>
                  <option value="packed">Packed</option>
                </select>
              </div>
            </div>

            {/* Water Clarity */}
            <div className="mt-4">
              <Label className="text-sm text-gray-700">Water Clarity</Label>
              <select
                value={formData.conditions?.waterClarity || 'good'}
                onChange={(e) => setFormData({
                  ...formData,
                  conditions: { ...formData.conditions, waterClarity: e.target.value as any }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="excellent">Excellent (30+ ft visibility)</option>
                <option value="good">Good (15-30 ft visibility)</option>
                <option value="fair">Fair (5-15 ft visibility)</option>
                <option value="poor">Poor (&lt;5 ft visibility)</option>
              </select>
            </div>

            {/* Beach Cleanliness */}
            <div className="mt-4">
              <Label className="text-sm text-gray-700">Beach Cleanliness</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      conditions: { ...formData.conditions, beachCleanliness: rating as any }
                    })}
                    className={`p-1 rounded ${
                      (formData.conditions?.beachCleanliness || 4) >= rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {formData.conditions?.beachCleanliness || 4}/5
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Severity Level */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Severity Level
          </Label>
          <div className="flex gap-3">
            {[
              { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
              { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
              { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' }
            ].map((severity) => (
              <label key={severity.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="severity"
                  value={severity.value}
                  checked={formData.severity === severity.value}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="sr-only"
                />
                <div className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.severity === severity.value
                    ? severity.color
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                  {severity.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
            <Camera className="h-4 w-4" />
            Photos (optional)
          </Label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {photos.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {photos.length} photo{photos.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Reporter Info (optional) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Contact Info (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reporterName" className="text-sm text-gray-700">Name</Label>
              <Input
                id="reporterName"
                value={formData.reporterName || ''}
                onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reporterEmail" className="text-sm text-gray-700">Email</Label>
              <Input
                id="reporterEmail"
                type="email"
                value={formData.reporterEmail || ''}
                onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Providing contact info helps us verify reports and follow up if needed.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.title || !formData.description}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}