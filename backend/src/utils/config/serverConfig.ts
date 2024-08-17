import { z } from 'zod'

const ServerEnvSchema = z.object({
  port: z.number().refine((val) => val > 1024, { message: 'Port must be over 1024' }),
  secretKeyOne: z.string(),
  secretKeyTwo: z.string(),
  sessionName: z.string(),
  clientURL: z.string(),
  JWT_TOKEN: z.string()
})
export type Server = z.infer<typeof ServerEnvSchema>

export const getServeValue = () =>
  ServerEnvSchema.parse({
    port: parseInt(z.string().parse(process.env.PORT || 3000), 10),
    secretKeyOne: z.string().parse(process.env.SECRET_KEY_ONE),
    secretKeyTwo: z.string().parse(process.env.SECRET_KEY_TWO),
    sessionName: z.string().parse(process.env.SESSION_NAME),
    clientURL: z.string().parse(process.env.CLIENT_URL),
    JWT_TOKEN: z.string().parse(process.env.JWT_TOKEN),
  })
