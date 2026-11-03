import { timingSafeEqual } from 'crypto'

/**
 * Constant-time string comparison using Node.js crypto.timingSafeEqual.
 * Prevents timing attacks on secret comparison (e.g. API keys, webhook secrets).
 * 
 * Both strings are UTF-8 encoded to buffers and compared with constant time.
 * Returns false if lengths differ (also constant time via timingSafeEqual).
 */
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8')
    const bufB = Buffer.from(b, 'utf8')
    
    // timingSafeEqual throws if lengths differ, which is still constant time
    // for the length check but not for the value comparison
    if (bufA.length !== bufB.length) {
      return false
    }
    
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}
