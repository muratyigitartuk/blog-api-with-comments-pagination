import { v2 as cloudinary } from 'cloudinary'
import { config } from './env'

if (config.cloudinaryUrl) cloudinary.config({ cloudinary_url: config.cloudinaryUrl as any })

export { cloudinary }