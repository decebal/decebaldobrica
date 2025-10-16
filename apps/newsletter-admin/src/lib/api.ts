/**
 * API client for newsletter admin
 * Makes requests to the main web app's API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function apiClient(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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
  getStats: () => apiClient("/api/newsletter/stats"),

  getSubscribers: (params?: { tier?: string; status?: string }) => {
    const query = new URLSearchParams(params as any)
    return apiClient(`/api/newsletter/subscribers?${query}`)
  },

  sendNewsletter: (data: { subject: string; content: string; tier: string }) =>
    apiClient("/api/newsletter/send", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAnalytics: () => apiClient("/api/newsletter/analytics"),
}
