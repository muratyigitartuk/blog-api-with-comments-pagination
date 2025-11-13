import { cloudinary } from '../config/cloudinary'

export async function uploadBuffer(buffer: Buffer, folder?: string) {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err || !result) return reject(err)
      resolve({ secure_url: (result as any).secure_url })
    })
    stream.end(buffer)
  })
}