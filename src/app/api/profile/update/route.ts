import { NextResponse } from 'next/server';
import cloudinary from '../../../../lib/cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
}

export const config = {
  runtime: 'nodejs',
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No file uploaded or wrong file type' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'profile_images' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        ).end(buffer);
      }
    );

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
