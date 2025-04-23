import { z } from 'zod'

export const SocialLinkSchema = z.object({
  type: z.string(),
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
})

export const SaveProfileSchema = z.object({
  full_name: z.string(),
  website: z.string().url(),
  name: z.string(),
  logo: z.string().nullable(),
  description: z.string(),
  links: z.array(SocialLinkSchema).optional(), // 👈 facultatif
})

export type SaveProfileInput = z.infer<typeof SaveProfileSchema>
