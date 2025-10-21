/**
 * API client for newsletter admin
 * Makes requests to local API routes
 */

export async function apiClient(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Newsletter API endpoints
export const newsletterApi = {
  getStats: () => apiClient('/api/newsletter/stats'),

  getSubscribers: (params?: { tier?: string; status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>)
    return apiClient(`/api/newsletter/subscribers?${query}`)
  },

  sendNewsletter: (data: { subject: string; content: string; tier: string }) =>
    apiClient('/api/newsletter/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAnalytics: () => apiClient('/api/newsletter/analytics'),
}
