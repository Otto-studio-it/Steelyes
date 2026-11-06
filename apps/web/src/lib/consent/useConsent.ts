'use client'

import { useEffect, useState, useCallback } from 'react'

export const CONSENT_VERSION = 1
export const CONSENT_KEY = 'sy_cookie_consent'
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000 // 12 months

export type ConsentCategory = 'analytics' | 'marketing'

export interface ConsentState {
  version: number
  timestamp: number
  categories: {
    analytics: boolean
    marketing: boolean
  }
}

type ConsentListener = (state: ConsentState) => void

const listeners = new Set<ConsentListener>()

function notifyListeners(state: ConsentState) {
  listeners.forEach((listener) => listener(state))
}

export function onConsent(listener: ConsentListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function loadConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return null
    
    // Handle legacy format (simple string)
    if (stored === 'accepted') {
      return null // Re-prompt with new format
    }
    
    const parsed = JSON.parse(stored) as ConsentState
    
    // Validate structure
    if (!parsed.version || !parsed.timestamp || !parsed.categories) {
      return null
    }
    
    // Re-prompt if version changed
    if (parsed.version !== CONSENT_VERSION) {
      return null
    }
    
    // Re-prompt if older than 12 months
    const age = Date.now() - parsed.timestamp
    if (age > CONSENT_MAX_AGE_MS) {
      return null
    }
    
    return parsed
  } catch {
    return null
  }
}

export function saveConsent(categories: { analytics: boolean; marketing: boolean }): void {
  if (typeof window === 'undefined') return
  
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    categories,
  }
  
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
    notifyListeners(state)
  } catch {
    // localStorage blocked
  }
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(CONSENT_KEY)
  } catch {
    // localStorage blocked
  }
}

export function useConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setConsent(loadConsent())
    setLoading(false)
    
    const unsubscribe = onConsent(setConsent)
    return unsubscribe
  }, [])
  
  const updateConsent = useCallback((categories: { analytics: boolean; marketing: boolean }) => {
    saveConsent(categories)
    setConsent(loadConsent())
  }, [])
  
  const acceptAll = useCallback(() => {
    updateConsent({ analytics: true, marketing: true })
  }, [updateConsent])
  
  const rejectAll = useCallback(() => {
    updateConsent({ analytics: false, marketing: false })
  }, [updateConsent])
  
  const hasConsent = useCallback((category: ConsentCategory): boolean => {
    return consent?.categories[category] ?? false
  }, [consent])
  
  return {
    consent,
    loading,
    hasConsent,
    updateConsent,
    acceptAll,
    rejectAll,
  }
}
