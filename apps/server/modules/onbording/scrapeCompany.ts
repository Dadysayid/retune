
import OpenAI from 'openai'
import { enrichLinks } from './enrichLinks'

export type SocialLink = {
  type: string
  url: string
}

export type ScrapedCompany = {
  name: string
  logo: string | null
  description: string
  links: SocialLink[]
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function scrapeCompany(fullName: string, website: string): Promise<ScrapedCompany> {
  const systemPrompt = `
You are a web scraping assistant. You will ONLY extract links that are *explicitly present in the HTML of the given website*.

Your response must call the function "return_scraped_data" with JSON matching:
{
  "name": string,
  "logo": string | null,
  "description": string,
  "links": [
    {
      "type": "facebook|linkedin|instagram|youtube|x|blog|news|tiktok",
      "url": string
    }
  ]
}

Rules:
1. DO NOT invent links. Only include links that you find directly in the page's HTML.
2. If none are found, return an empty array.
3. NO extra output. Just the function call with valid JSON.
  `

  const userPrompt = `Scrape data from: ${website}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-0613',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    functions: [
      {
        name: 'return_scraped_data',
        description: 'Return scraped data as JSON. No explanations or text, just the JSON in the arguments.',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            logo: { type: ['string', 'null'] },
            description: { type: 'string' },
            links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  url: { type: 'string' }
                },
                required: ['type', 'url']
              }
            }
          },
          required: ['name', 'logo', 'description', 'links']
        }
      }
    ],
    function_call: { name: 'return_scraped_data' }
  })

  const args = response.choices?.[0]?.message?.function_call?.arguments

  if (!args) throw new Error('No function call arguments from OpenAI')

  let parsed: ScrapedCompany
  try {
    parsed = JSON.parse(args)
  } catch (err) {
    console.error('❌ Failed to parse GPT response JSON:', err)
    throw new Error('Invalid JSON response from GPT')
  }

  const enrichedLinks = await enrichLinks(parsed.links)

  return {
    name: parsed.name,
    logo: parsed.logo,
    description: parsed.description,
    links: enrichedLinks
  }
}
