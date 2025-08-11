'use client'

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share'
import { Share2, Camera, Download } from 'lucide-react'
import { useState } from 'react'
import { trackSocialShare } from '@/lib/analytics'
import html2canvas from 'html2canvas'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  imageUrl?: string
  beachData?: any
}

export function SocialShare({ url, title, description, hashtags = ['BeachHui', 'HawaiiBeaches', 'BeachSafety'], beachData }: SocialShareProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}${url}`
  
  const handleShare = (platform: string) => {
    trackSocialShare(platform, title)
    setShowShareMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {showShareMenu && (
        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg p-4 z-50 min-w-[200px]">
          <div className="grid grid-cols-2 gap-3">
            <FacebookShareButton
              url={shareUrl}
              quote={description || title}
              hashtag={`#${hashtags[0]}`}
              onClick={() => handleShare('facebook')}
            >
              <div className="flex flex-col items-center gap-1 hover:opacity-80">
                <FacebookIcon size={40} round />
                <span className="text-xs">Facebook</span>
              </div>
            </FacebookShareButton>

            <TwitterShareButton
              url={shareUrl}
              title={title}
              hashtags={hashtags}
              onClick={() => handleShare('twitter')}
            >
              <div className="flex flex-col items-center gap-1 hover:opacity-80">
                <TwitterIcon size={40} round />
                <span className="text-xs">Twitter</span>
              </div>
            </TwitterShareButton>

            <WhatsappShareButton
              url={shareUrl}
              title={title}
              onClick={() => handleShare('whatsapp')}
            >
              <div className="flex flex-col items-center gap-1 hover:opacity-80">
                <WhatsappIcon size={40} round />
                <span className="text-xs">WhatsApp</span>
              </div>
            </WhatsappShareButton>

            <EmailShareButton
              url={shareUrl}
              subject={`Check out ${title} on Beach Hui`}
              body={description}
              onClick={() => handleShare('email')}
            >
              <div className="flex flex-col items-center gap-1 hover:opacity-80">
                <EmailIcon size={40} round />
                <span className="text-xs">Email</span>
              </div>
            </EmailShareButton>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              handleShare('copy')
              alert('Link copied to clipboard!')
            }}
            className="w-full mt-3 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  )
}

interface ShareableBeachCardProps {
  beach: any
  elementId: string
}

export function ShareableBeachCard({ beach, elementId }: ShareableBeachCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateShareImage = async () => {
    setIsGenerating(true)
    try {
      const element = document.getElementById(elementId)
      if (!element) return

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      })

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) return

        // Create download link
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `beach-hui-${beach.name.toLowerCase().replace(/ /g, '-')}.png`
        a.click()
        URL.revokeObjectURL(url)

        trackSocialShare('download', beach.name)
      }, 'image/png')
    } catch (error) {
      console.error('Failed to generate share image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="relative">
      <div
        id={elementId}
        className="bg-gradient-to-br from-ocean-400 to-ocean-600 p-6 rounded-xl text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{beach.name}</h2>
          <div className="text-3xl font-bold">{beach.safetyScore}/100</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm opacity-90">Waves</div>
            <div className="text-xl font-semibold">{beach.waveHeight} ft</div>
          </div>
          <div>
            <div className="text-sm opacity-90">Water</div>
            <div className="text-xl font-semibold">{beach.waterTemp}°F</div>
          </div>
          <div>
            <div className="text-sm opacity-90">UV</div>
            <div className="text-xl font-semibold">{beach.uvIndex}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Beach Hui" className="h-6" />
            <span className="text-sm">Beach Hui</span>
          </div>
          <div className="text-sm opacity-90">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <button
        onClick={generateShareImage}
        disabled={isGenerating}
        className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
      >
        {isGenerating ? (
          <div className="animate-spin h-5 w-5 border-2 border-ocean-500 border-t-transparent rounded-full" />
        ) : (
          <Camera className="h-5 w-5 text-ocean-600" />
        )}
      </button>
    </div>
  )
}

// Beach selfie frame component
export function BeachSelfieFrame({ beach, uvIndex }: { beach: string, uvIndex: number }) {
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelfieUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="relative">
      {selfieUrl ? (
        <div className="relative">
          <img src={selfieUrl} alt="Beach selfie" className="w-full rounded-xl" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">I survived UV {uvIndex} at {beach}! ☀️</h3>
              <p className="text-sm opacity-90">Protected by Beach Hui 🌊</p>
            </div>
          </div>
          <button
            onClick={() => {
              // Download the framed image
              trackSocialShare('selfie', beach)
            }}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <label className="block w-full p-12 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-ocean-500 transition-colors">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Upload your beach selfie</p>
          <p className="text-sm text-gray-500 mt-1">Add a UV survivor frame!</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}