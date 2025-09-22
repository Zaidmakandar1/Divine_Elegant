import { v2 as cloudinary } from 'cloudinary';

const isEnabled = Boolean(
  (process.env.CLOUDINARY_CLOUD_NAME || '').trim() &&
  (process.env.CLOUDINARY_API_KEY || '').trim() &&
  (process.env.CLOUDINARY_API_SECRET || '').trim()
);

if (isEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export const cloudinaryEnabled = isEnabled;

export async function uploadImageBufferToCloudinary(buffer, filename) {
  if (!isEnabled) throw new Error('Cloudinary not configured');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'divine_elegant/products',
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
        filename_override: filename
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}


