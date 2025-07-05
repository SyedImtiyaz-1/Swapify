'use client'

import dynamic from 'next/dynamic'

const PWAInstallPrompt = dynamic(() => import('./PWAInstallPrompt'), {
  ssr: false
})

const PWAInstallPromptWrapper = () => {
  return <PWAInstallPrompt />
}

export default PWAInstallPromptWrapper 