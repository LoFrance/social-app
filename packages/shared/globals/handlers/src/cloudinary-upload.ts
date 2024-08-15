import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export function upload(
  file: string, // base64 encoded string
  // I can set my own id or get the cloduinary id generated
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error); // handling reject case on my own
        resolve(result);
      }
    )
  })
}