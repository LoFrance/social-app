import { z } from 'zod'
import cloudinary from 'cloudinary'

interface ICloduinaryConfig {
  cloud_name: string
  api_key: string
  api_secret: string
}

const CloudinaryEnvSchema = z.object({
  cloud_name: z.string(),
  app_key: z.string(),
  app_secret: z.string(),
})
export type Cloudinary = z.infer<typeof CloudinaryEnvSchema>

export const getCloudinaryValue = () =>
  CloudinaryEnvSchema.parse({
    cloud_name: z.string().parse(process.env.CLOUDINARY_NAME),
    app_key: z.string().parse(process.env.CLOUDINARY_APP_KEY),
    app_secret: z.string().parse(process.env.CLOUDINARY_API_KEY_SECRET),
  })

export const setCloudinaryConfig = (configObj: ICloduinaryConfig) => {
  cloudinary.v2.config(configObj)
}
