'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Waves, Bell, CreditCard, Settings, LogOut, Plus, 
  AlertTriangle, Check, X,
  Mail, MessageSquare, Clock, TrendingUp
} from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  tier: string
  subscriptionStatus: string
  trialEndDate?: string
}

interface AlertData {
  id: string
  name: string
  isActive: boolean
  channels: string[]
  createdAt: string
  rules: Array<{
    beach: {
      name: string
      island: string
    }
    metric: string
    operator: string
    threshold?: number
  }>
  history: Array<{
    beachName: string
    condition: string
    message: string
    sentAt: string
  }>
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    fetchAlerts(token)
  }, [router])

  const fetchAlerts = async (token: string) => {
    try {
      const response = await fetch('/api/alerts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }
      
      const data = await response.json()
      setAlerts(data.alerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const deleteAlert = async (alertId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete alert')
      }
      
      setAlerts(prev => prev.filter(a => a.id !== alertId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete alert')
    }
  }

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update alert')
      }
      
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, isActive: !isActive } : a
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update alert')
    }
  }

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'consumer': return 'bg-blue-100 text-blue-800'
      case 'business': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-amber-100 text-amber-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierPrice = (tier: string) => {
    switch(tier) {
      case 'free': return 'Free'
      case 'consumer': return '$4.99/mo'
      case 'business': return '$49/mo'
      case 'enterprise': return '$199/mo'
      default: return 'Free'
    }
  }

  const getTierLimits = (tier: string) => {
    switch(tier) {
      case 'free': return { alerts: 3, sms: false, api: false, history: 7 }
      case 'consumer': return { alerts: 10, sms: true, api: false, history: 30 }
      case 'business': return { alerts: -1, sms: true, api: true, history: 90 }
      case 'enterprise': return { alerts: -1, sms: true, api: true, history: 365 }
      default: return { alerts: 3, sms: false, api: false, history: 7 }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Waves className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const limits = getTierLimits(user.tier)
  const daysUntilTrialEnd = user.trialEndDate 
    ? Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Waves className="h-8 w-8 text-blue-600" />
                <span className="font-bold text-xl">Reef Safety</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className={getTierColor(user.tier)}>
                {user.tier.toUpperCase()} - {getTierPrice(user.tier)}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || user.email}
          </h1>
          <p className="text-gray-600">Manage your beach safety alerts and subscription</p>
        </div>

        {/* Trial/Subscription Alert */}
        {user.subscriptionStatus === 'trial' && daysUntilTrialEnd !== null && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Your free trial ends in {daysUntilTrialEnd} days. 
              <Link href="/pricing" className="font-medium underline ml-1">
                Upgrade now
              </Link>
              {' '}to keep all your alerts active.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.filter(a => a.isActive).length}</div>
              <p className="text-xs text-muted-foreground">
                {limits.alerts === -1 ? 'Unlimited' : `of ${limits.alerts} allowed`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Notifications Sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.reduce((sum, a) => sum + a.history.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>SMS Alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {limits.sms ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : (
                  <X className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {limits.sms ? 'Enabled' : 'Upgrade required'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>API Access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {limits.api ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : (
                  <X className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {limits.api ? 'Enabled' : 'Business+ required'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Beach Alerts</h2>
              <Button disabled={limits.alerts !== -1 && alerts.length >= limits.alerts}>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
            
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No alerts configured</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first beach safety alert to get started
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Alert
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {alerts.map(alert => (
                  <Card key={alert.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{alert.name}</CardTitle>
                          <CardDescription>
                            {alert.rules[0]?.beach.name} ({alert.rules[0]?.beach.island})
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                            {alert.isActive ? 'Active' : 'Paused'}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleAlert(alert.id, alert.isActive)}
                          >
                            {alert.isActive ? 'Pause' : 'Resume'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {alert.channels.includes('email') && <Mail className="h-4 w-4" />}
                          {alert.channels.includes('sms') && <MessageSquare className="h-4 w-4" />}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {alert.history.length} notifications sent
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{user.tier.toUpperCase()} Plan</h3>
                    <p className="text-sm text-gray-600">{getTierPrice(user.tier)}</p>
                  </div>
                  {user.tier !== 'enterprise' && (
                    <Button>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Plan Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {limits.alerts === -1 ? 'Unlimited' : limits.alerts} beach alerts
                    </li>
                    <li className="flex items-center gap-2">
                      {limits.sms ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      SMS notifications
                    </li>
                    <li className="flex items-center gap-2">
                      {limits.api ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                      API access
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {limits.history} days historical data
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-gray-600">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account ID</Label>
                  <p className="text-sm text-gray-600 font-mono">{user.id}</p>
                </div>
                <Button variant="outline">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Add missing Label component
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={className}>{children}</label>
}