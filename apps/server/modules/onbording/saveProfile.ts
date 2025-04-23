import { v4 as uuidv4 } from 'uuid'
// <-- adapte si besoin

import { createSupabaseServerClient } from '../../libs/supabaseClient'

type SaveProfileProps = {
  full_name: string
  website: string
  name: string
  logo: string | null
  description: string
  links?: SocialLink[]
}
export type SocialLink = {
  type: string;
  url: string;
  title?: string;
  description?: string;
  image?: string; // This is the external link from enrichLinks, if any
};

export async function saveProfile({
  full_name,
  website,
  name,
  logo,
  description,
  links = [],
}: SaveProfileProps) {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Crée user s'il n'existe pas
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingUser) {
    const { error } = await supabase.from('users').insert({
      id: user.id,
      full_name,
    })

    if (error) throw new Error('Insert user failed: ' + error.message)
  }

  // Crée l'organisation
  const { data: organization, error: orgError } = await supabase
    .from('organization')
    .insert({
      name,
      website,
      logo_url: logo,
      description,
    })
    .select()
    .single()

  if (orgError || !organization?.id)
    throw new Error('Organization creation failed: ' + orgError?.message)

  // Ajoute le membre propriétaire
  const { error: memberError } = await supabase.from('organization_members').insert({
    user_id: user.id,
    organization_id: organization.id,
    role: 'owner',
  })

  if (memberError)
    throw new Error('Organization member creation failed: ' + memberError.message)

  // Met à jour le full name
  const { error: updateUserError } = await supabase
    .from('users')
    .update({ full_name })
    .eq('id', user.id)

  if (updateUserError)
    throw new Error('Failed to update user full_name: ' + updateUserError.message)

  // Insère les liens sociaux enrichis
  for (const link of links) {
    if (!link.url || !link.type) continue

    let image_url: string | null = null

    if (link.image) {
      image_url = await uploadImageToSupabase(link.image, `socials/${uuidv4()}`)
    }

    const { error: socialError } = await supabase.from('organization_social').insert({
      organization_id: organization.id,
      social_type: link.type,
      url: link.url,
      title: link.title ?? null,
      description: link.description ?? null,
      image_url: image_url ?? null,
    })

    if (socialError) {
      console.error(`❌ Error inserting social link: ${link.type}`, socialError.message)
    }
  }

  console.log('✅ Profile and social links saved successfully!')
}

// Upload d'image vers Supabase Storage
async function uploadImageToSupabase(imageUrl: string, path: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      console.error(`❌ Could not fetch image ${imageUrl}: ${response.status}`)
      return null
    }

    const blob = await response.blob()

    if (!blob || blob.size === 0) return null

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.storage.from('social-images').upload(path, blob, {
      contentType: blob.type,
      upsert: true,
    })

    if (error) {
      console.error('❌ Upload failed:', error.message)
      return null
    }

    const { data: publicUrlData } = supabase.storage.from('social-images').getPublicUrl(data.path)

    return publicUrlData.publicUrl
  } catch (err) {
    console.error('❌ Upload error:', err)
    return null
  }
}
