import { z } from 'zod'

const CookieEnvSchema = z.object({
  maxAge: z.number(),
  isSecure: z.boolean(),
})
export type Cookie = z.infer<typeof CookieEnvSchema>

export const getCookieValue = () =>
  CookieEnvSchema.parse({
    maxAge: parseInt(z.string().parse(process.env.MAX_AGE), 10),
    isSecure: process.env.NODE_ENV !== 'development',
  })