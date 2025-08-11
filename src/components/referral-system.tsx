'use client'

import { useState, useEffect } from 'react'
import { Gift, Users, Copy, Share2, Check, Trophy, Star } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { trackEngagement } from '@/lib/analytics'
import toast from 'react-hot-toast'

export function ReferralSystem() {
  const { user } = useAuth()
  const [referralCode, setReferralCode] = useState('')
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    earnings: 0,
    nextReward: 3
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user) {
      // Generate referral code from user email
      const code = user.email.split('@')[0].toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase()
      setReferralCode(code)
      
      // Fetch referral stats (mock data for now)
      setReferralStats({
        totalReferrals: Math.floor(Math.random() * 10),
        activeReferrals: Math.floor(Math.random() * 5),
        earnings: Math.floor(Math.random() * 50),
        nextReward: 3
      })
    }
  }, [user])

  const copyReferralLink = () => {
    const link = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEngagement('referral_copy', { code: referralCode })
    toast.success('Referral link copied!')
  }

  const shareReferral = (platform: string) => {
    const link = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${referralCode}`
    const message = `🌊 Join me on Beach Hui! Get real-time beach conditions, safety alerts, and reef health data for Hawaii's beaches. Sign up with my code ${referralCode} for a FREE month of Pro! `
    
    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(link)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + link)}`,
      email: `mailto:?subject=Join Beach Hui&body=${encodeURIComponent(message + link)}`
    }
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank')
      trackEngagement('referral_share', { platform, code: referralCode })
    }
  }

  const rewards = [
    { referrals: 1, reward: '1 month free Pro', icon: '🎁', earned: referralStats.totalReferrals >= 1 },
    { referrals: 3, reward: '3 months free Pro', icon: '🏆', earned: referralStats.totalReferrals >= 3 },
    { referrals: 5, reward: 'Beach Hui T-shirt', icon: '👕', earned: referralStats.totalReferrals >= 5 },
    { referrals: 10, reward: 'Lifetime Pro access', icon: '🌟', earned: referralStats.totalReferrals >= 10 },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Refer Friends & Earn Rewards</h2>
          <p className="text-gray-600 mt-1">Share Beach Hui and get free Pro access!</p>
        </div>
        <Gift className="h-8 w-8 text-ocean-600" />
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-ocean-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Your referral code</p>
            <p className="text-3xl font-bold text-ocean-600">{referralCode}</p>
          </div>
          <button
            onClick={copyReferralLink}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => shareReferral('twitter')}
            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Twitter
          </button>
          <button
            onClick={() => shareReferral('facebook')}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Facebook
          </button>
          <button
            onClick={() => shareReferral('whatsapp')}
            className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
          >
            WhatsApp
          </button>
          <button
            onClick={() => shareReferral('email')}
            className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
          >
            Email
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Users className="h-6 w-6 text-ocean-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{referralStats.totalReferrals}</div>
          <div className="text-sm text-gray-600">Total Referrals</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{referralStats.activeReferrals}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">${referralStats.earnings}</div>
          <div className="text-sm text-gray-600">Earned</div>
        </div>
      </div>

      {/* Rewards Progress */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Unlock Rewards</h3>
        <div className="space-y-3">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                reward.earned
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{reward.icon}</span>
                <div>
                  <p className={`font-medium ${reward.earned ? 'text-green-900' : 'text-gray-900'}`}>
                    {reward.reward}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reward.referrals} referral{reward.referrals > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {reward.earned ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <span className="text-sm text-gray-500">
                  {reward.referrals - referralStats.totalReferrals} more
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Share your referral code or link with friends</li>
          <li>2. They sign up using your code</li>
          <li>3. Both of you get 1 month of Pro FREE</li>
          <li>4. Unlock more rewards with more referrals!</li>
        </ol>
      </div>
    </div>
  )
}