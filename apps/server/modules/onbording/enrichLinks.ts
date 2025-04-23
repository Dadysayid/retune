// enrichLinks.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export type EnrichedLink = {
  type: string;
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
};

export async function enrichLinks(links: { type: string; url: string }[]): Promise<EnrichedLink[]> {
  return Promise.all(
    links.map(async (link) => {
      try {
        // 1) Fetch the HTML
        const { data } = await axios.get(link.url);
        
        // 2) Load into Cheerio
        const $ = cheerio.load(data);

        // 3) Extract <title>
        const title = $('title').first().text() || null;

        // 4) Extract <meta name="description"> or <meta property="og:description">
        let description =
          $('meta[name="description"]').attr('content') ||
          $('meta[property="og:description"]').attr('content') ||
          null;

        // 5) Extract <meta property="og:image"> or <meta name="twitter:image">
        let image =
          $('meta[property="og:image"]').attr('content') ||
          $('meta[name="twitter:image"]').attr('content') ||
          null;

        // Return the final metadata
        return {
          type: link.type,
          url: link.url,
          title,
          description,
          image,
        };
      } catch (error) {
        console.error(`❌ Could not fetch ${link.url}:`, error);
        // Fallback if any error
        return {
          type: link.type,
          url: link.url,
          title: null,
          description: null,
          image: null,
        };
      }
    })
  );
}
