'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Toast {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

let toastListeners: ((toast: Toast) => void)[] = []

export function toast(toast: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(7)
  const fullToast = { ...toast, id }
  toastListeners.forEach(listener => listener(fullToast))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts(prev => [...prev, toast])
      
      const duration = toast.duration || 5000
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, duration)
    }

    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm animate-slide-up',
            {
              'bg-green-50 border border-green-200': toast.type === 'success',
              'bg-red-50 border border-red-200': toast.type === 'error',
              'bg-blue-50 border border-blue-200': toast.type === 'info',
            }
          )}
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
          </div>
          <div className="flex-1">
            <p className={cn(
              'font-medium',
              {
                'text-green-900': toast.type === 'success',
                'text-red-900': toast.type === 'error',
                'text-blue-900': toast.type === 'info',
              }
            )}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={cn(
                'mt-1 text-sm',
                {
                  'text-green-700': toast.type === 'success',
                  'text-red-700': toast.type === 'error',
                  'text-blue-700': toast.type === 'info',
                }
              )}>
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}