import { NextResponse } from "next/server"
import { getNewsletterStats } from "@decebal/newsletter"

export async function GET() {
  try {
    const stats = await getNewsletterStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Newsletter stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
