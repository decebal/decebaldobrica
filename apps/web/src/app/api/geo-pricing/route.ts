import {
  calculateGeoPrice,
  detectLocationFromHeaders,
  formatPriceWithCurrency,
  getDiscountMessage,
  getGeoPricingConfig,
  getPricingTierDescription,
} from '@/lib/geoPricing'
import { MEETING_TYPES } from '@/lib/payments/config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * GET /api/geo-pricing
 * Detect user location and return geo-specific pricing information
 */
export async function GET() {
  try {
    // Get headers from the request
    const headersList = await headers()

    // Detect location from headers
    const location = detectLocationFromHeaders(headersList)

    // Get geo pricing configuration
    const geoConfig = getGeoPricingConfig(location)

    // Calculate prices for all meeting types with geo multiplier
    const meetingPrices = Object.entries(MEETING_TYPES).map(([key, config]) => {
      const basePrice = config.priceUsd || 0
      const geoPrice = calculateGeoPrice(basePrice, geoConfig)

      return {
        meetingType: config.name,
        duration: config.durationMinutes || 30,
        requiresPayment: (config.priceSol || 0) > 0,
        description: config.description,
        basePrice: basePrice, // Original USD price
        geoPrice: geoPrice, // Adjusted price based on location
        formattedPrice: formatPriceWithCurrency(geoPrice, geoConfig.currency),
        priceCrypto: config.priceSol || 0, // SOL price
      }
    })

    // Get discount message if applicable
    const discountMessage = getDiscountMessage(geoConfig)

    // Get pricing tier description
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
