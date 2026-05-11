import { NextResponse } from "next/server"

// Use the new, correct URL provided by the user
const EXTERNAL_API_URL = "https://api.callemily.ru/api/tables/status"
// Reinstate the API_KEY as per user instruction
const API_KEY = "restaurant_secret_key_2024" // For a real app, use process.env.RESTAURANT_API_KEY

export async function GET() {
  try {
    if (!API_KEY) {
      // This check is more for production best practices if the key were from an env var
      console.error("Restaurant API key is not configured (this should not happen with a hardcoded key).")
      return NextResponse.json({ error: "API key for restaurant service is missing." }, { status: 500 })
    }

    console.log(`Fetching from external API: ${EXTERNAL_API_URL}`)
    const response = await fetch(EXTERNAL_API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`, // Correctly send the API key
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15000), // 15-second timeout
    })

    const responseText = await response.text() // Get raw text first

    if (!response.ok) {
      console.error(
        `External API error: ${response.status} ${response.statusText}. URL: ${EXTERNAL_API_URL}. Response body:`,
        responseText,
      )
      return NextResponse.json(
        {
          error: `Failed to fetch data from external API: ${response.statusText}`,
          details: `Status: ${response.status}, URL: ${EXTERNAL_API_URL}, Body: ${responseText.substring(0, 500)}`,
        },
        { status: response.status },
      )
    }

    // Try to parse as JSON, but handle potential errors
    try {
      const data = JSON.parse(responseText)
      console.log("Successfully fetched and parsed data from external API.")
      return NextResponse.json(data)
    } catch (parseError) {
      console.error(
        "Failed to parse JSON response from external API. URL:",
        EXTERNAL_API_URL,
        "Raw response:",
        responseText,
        parseError,
      )
      return NextResponse.json(
        {
          error: "Received invalid JSON response from external API.",
          details: `URL: ${EXTERNAL_API_URL}, Raw response snippet: ${responseText.substring(0, 200)}...`,
        },
        { status: 502 }, // Bad Gateway, as the upstream server gave a bad response
      )
    }
  } catch (error) {
    console.error(`Error in /api/restaurant-status route. URL: ${EXTERNAL_API_URL}:`, error)
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: `Request to external API (${EXTERNAL_API_URL}) timed out.` },
        { status: 504 }, // Gateway Timeout
      )
    }
    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch failed")) {
      console.error(`Fetch failed for ${EXTERNAL_API_URL}, possibly network or DNS issue:`, error)
      return NextResponse.json(
        {
          error: `Network error: Failed to connect to the external API (${EXTERNAL_API_URL}).`,
          details: error.message,
        },
        { status: 503 }, // Service Unavailable
      )
    }
    return NextResponse.json(
      {
        error: `Internal server error while fetching restaurant status from ${EXTERNAL_API_URL}.`,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const dynamic = "force-dynamic"
