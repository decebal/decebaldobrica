import { headers as nextHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { MEETING_TYPES } from '../config'
import {
  calculateGeoPrice,
  detectLocationFromHeaders,
  formatPriceWithCurrency,
  getDiscountMessage,
  getGeoPricingConfig,
  getPricingTierDescription,
} from './geo-pricing-lib'

export * from './geo-pricing-lib'

/**
 * Returns a Next.js App Router GET handler that detects the caller's location
 * via request headers and responds with geo-adjusted meeting pricing.
 *
 * Consumers:
 *   // apps/web/src/app/api/geo-pricing/route.ts
 *   export const GET = createGeoPricingHandler()
 */
export function createGeoPricingHandler() {
  return async function GET() {
    try {
      const headersList = await nextHeaders()
      const location = detectLocationFromHeaders(headersList)
      const geoConfig = getGeoPricingConfig(location)

      const meetingPrices = Object.entries(MEETING_TYPES).map(([, config]) => {
        const basePrice = config.priceUsd || 0
        const geoPrice = calculateGeoPrice(basePrice, geoConfig)

        return {
          meetingType: config.name,
          duration: config.durationMinutes || 30,
          requiresPayment: (config.priceSol || 0) > 0,
          description: config.description,
          basePrice,
          geoPrice,
          formattedPrice: formatPriceWithCurrency(geoPrice, geoConfig.currency),
          priceCrypto: config.priceSol || 0,
        }
      })

      const discountMessage = getDiscountMessage(geoConfig)
      const tierDescription = getPricingTierDescription(geoConfig.tier)

      return NextResponse.json({
        success: true,
        location: {
          country: geoConfig.country,
          city: geoConfig.city,
          region: geoConfig.region,
          detected: location,
        },
        pricing: {
          tier: geoConfig.tier,
          tierName: geoConfig.tierName,
          currency: geoConfig.currency,
          multiplier: geoConfig.multiplier,
          description: tierDescription,
        },
        meetings: meetingPrices,
        discountEligible: geoConfig.discountEligible,
        discountMessage,
      })
    } catch (error) {
      console.error('Error in geo-pricing API:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to detect location',
        },
        { status: 500 }
      )
    }
  }
}
