'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SocialLink } from '../../types/social-link'
import { scrapeCompany } from './action/scrapcompany'


export default function OnboardingPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [scrapedData, setScrapedData] = useState<{
    name: string
    logo: string | null
    description: string
    links: SocialLink[]
  } | null>(null)
  const [links, setLinks] = useState<SocialLink[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const scraped = await scrapeCompany(fullName, website)
      setScrapedData(scraped)
      setLinks(scraped.links ?? [])
    } catch (err) {
      console.error('❌ Scraping failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    setLinks(prev => prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)))
  }

  const handleAddLink = () => {
    setLinks(prev => [...prev, { type: '', url: '' }])
  }

  const handleConfirm = async () => {
    if (!scrapedData) return

    const response = await fetch('/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        website,
        name: scrapedData.name,
        logo: scrapedData.logo,
        description: scrapedData.description,
        links,
      }),
    })

    if (response.ok) {
      router.push('/')
    } else {
      const err = await response.json()
      alert(`❌ Failed to save: ${err.error}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎯 Onboarding</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Company Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? 'Scraping...' : 'Scrape Info'}
        </button>
      </form>

      {scrapedData && (
        <div className="mt-6 border-t pt-6 space-y-4">
          <h2 className="text-xl font-semibold">Company Info</h2>
          <p><strong>Name:</strong> {scrapedData.name}</p>
          <p><strong>Description:</strong> {scrapedData.description}</p>
          {scrapedData.logo && <img src={scrapedData.logo} className="h-20" alt="Logo" />}

          <h3 className="mt-4 font-semibold">Social Links</h3>
          {links.map((link, i) => (
            <div key={i} className="border-b pb-4 mb-4 space-y-2">
              <input
                type="text"
                placeholder="Type (e.g. linkedin)"
                value={link.type}
                onChange={(e) => handleLinkChange(i, 'type', e.target.value)}
                className="w-full border border-gray-300 p-1 rounded"
              />
              <input
                type="url"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleLinkChange(i, 'url', e.target.value)}
                className="w-full border border-gray-300 p-1 rounded"
              />
              <input
                type="text"
                placeholder="Title (optional)"
                value={link.title ?? ''}
                onChange={(e) => handleLinkChange(i, 'title', e.target.value)}
                className="w-full border border-gray-300 p-1 rounded"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={link.description ?? ''}
                onChange={(e) => handleLinkChange(i, 'description', e.target.value)}
                className="w-full border border-gray-300 p-1 rounded"
              />
            </div>
          ))}

          <button type="button" onClick={handleAddLink} className="text-blue-600 underline text-sm">
            + Add another link
          </button>

          <button onClick={handleConfirm} className="mt-4 w-full bg-green-600 text-white py-2 rounded">
            Confirm and Save
          </button>
        </div>
      )}
    </div>
  )
}
