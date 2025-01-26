import * as AWS from 'aws-sdk';
import { PassThrough } from 'stream';

const S3 = new AWS.S3();
export function uploadLargeFiles(buffer: ArrayBuffer) {
  const pass = new PassThrough();
  const BUCKET = 'altergemu-team';
  const KEY = 'large/test/hui'; //
  const params: AWS.S3.Types.PutObjectRequest = {
    Bucket: BUCKET,
    Key: KEY,
    Body: pass,
  };

  const manager = S3.upload(params, (error, data) => {
    if (error) {
      console.error('Upload error:', error);
    } else {
      console.info('Upload succeeded:', data);
    }
  });

  manager.on('httpUploadProgress', (progress) => {
    console.log('Progress:', progress);
  });

  // Преобразуем Buffer в Node.js Buffer и передаем в поток
  const bufferNode = Buffer.from(buffer);
  pass.end(bufferNode); // Завершаем поток

  return pass;
}


