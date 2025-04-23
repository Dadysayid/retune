'use server'

export async function scrapeCompany(fullName: string, website: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

  const response = await fetch(`${baseUrl}/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ full_name: fullName, website }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Scraping failed')
  }

  return response.json()
}
