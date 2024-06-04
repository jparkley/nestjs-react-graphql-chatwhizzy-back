import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface S3FileUploadOptions {
  bucket: string;
  key: string;
  file: Buffer;
}

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  constructor(private readonly configService: ConfigService) {
    const accessKeyId = configService.get('AWS_ACCESS_KEY');
    const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');

    const s3ClientConfig: S3ClientConfig = {
      region: configService.get('AWS_REGION'),
    };
    // for local dev
    if (accessKeyId && secretAccessKey) {
      s3ClientConfig.credentials = { accessKeyId, secretAccessKey };
    }

    this.s3Client = new S3Client(s3ClientConfig);
  }

  async upload({ bucket, key, file }: S3FileUploadOptions) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
      }),
    );
  }

  getImageUrl(bucket: string, key: string) {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}
