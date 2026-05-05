export interface TurnstileVerifier {
  verify(token: string, ip?: string): Promise<{ success: boolean; errorCodes?: string[] }>
}

/**
 * Build a Cloudflare Turnstile server-side verifier. Secret key is injected —
 * no process.env reads inside the verifier.
 */
export function createTurnstileVerifier(secretKey: string | undefined): TurnstileVerifier {
  return {
    async verify(token: string, ip?: string) {
      if (!secretKey) {
        console.warn('⚠️ Turnstile secret key not configured - skipping verification')
        return { success: true }
      }

      try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: secretKey,
            response: token,
            remoteip: ip,
          }),
        })

        const data = (await response.json()) as {
          success: boolean
          'error-codes'?: string[]
        }
        return {
          success: data.success === true,
          errorCodes: data['error-codes'],
        }
      } catch (error) {
        console.error('Turnstile verification error:', error)
        return { success: false, errorCodes: ['network_error'] }
      }
    },
  }
}
