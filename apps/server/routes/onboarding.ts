import { Elysia } from 'elysia'
import { SaveProfileInput, SaveProfileSchema } from '../validators/onboardingSchema'
import { saveProfile } from '../modules/onbording/saveProfile'


export const onboardingRoute = new Elysia().post('/onboarding', async ({ body, set }) => {
  const result = SaveProfileSchema.safeParse(body)

  if (!result.success) {
    set.status = 400
    return {
      error: 'Invalid input',
      details: result.error.flatten(),
    }
  }

  try {
    await saveProfile(result.data as SaveProfileInput)
    return { success: true, message: 'Profile saved successfully' }
  } catch (err: any) {
    console.error('❌ Error in saveProfile:', err)
    set.status = 500
    return { error: 'Failed to save profile', details: err.message }
  }
})
