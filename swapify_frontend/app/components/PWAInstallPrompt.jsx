'use client'

import { useState, useEffect } from 'react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if running as standalone PWA
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
      
      // Check if iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream
      setIsIOS(isIOSDevice)

      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setIsInstallable(true)
      }

      // Listen for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      // Cleanup
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }
  }

  if (isStandalone || (!isInstallable && !isIOS)) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Install Swapify App
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {isIOS 
              ? 'To install, tap the share button and select "Add to Home Screen"'
              : 'Install our app for a better experience'
            }
          </p>
        </div>
        
        {!isIOS && isInstallable && (
          <button
            onClick={handleInstallClick}
            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Install
          </button>
        )}
      </div>
    </div>
  )
}

export default PWAInstallPrompt 