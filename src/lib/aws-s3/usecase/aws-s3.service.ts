import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import sharp from 'sharp';
import { FileMimeTypeEnum } from '../../../core/enums/allowed-filetype.enum';
import {
  validateFileExtension,
  validateFileSize,
} from '../../../core/utils/file-validation';
import { generateFileName } from '../../../core/utils/generate.filename';
import { AWS_S3_MODULE_OPTIONS, AwsS3ModuleOptions } from '../types';

export class UploadedFileObj {
  name: string;
  size: number;
  mime_type: string;
  url: string;
  aws_obj: ManagedUpload.SendData;
}
@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(AWS_S3_MODULE_OPTIONS)
    private readonly options: AwsS3ModuleOptions,
  ) {}

  async compressAndParseImageToJpeg(buffer: Buffer): Promise<Buffer> {
    // Compress and convert the image to JPEG format using sharp
    const compressedImage = await sharp(buffer)
      .resize({ width: 800 }) // Resize the image to a width of 800px, keeping aspect ratio
      .jpeg({ quality: 80 }) // Compress the image and convert it to JPEG with 80% quality
      .toBuffer(); // Convert the processed image to a Buffer
    return compressedImage;
  }

  public async uploadFile(
    file: Express.Multer.File,
    allowedFileTypes: FileMimeTypeEnum[],
    path: string,
    maxSize: number = 1024 * 1024 * 5,
  ): Promise<UploadedFileObj> {
    const fileName = generateFileName(
      file.originalname,
      file.mimetype as FileMimeTypeEnum,
    );

    validateFileExtension(file, allowedFileTypes);
    validateFileSize(file, maxSize);

    let buffer = file.buffer;
    let isImage = false;
    //if the file is an image (parse to jpeg and compress)
    if (
      [
        FileMimeTypeEnum.JPEG,
        FileMimeTypeEnum.JPG,
        FileMimeTypeEnum.PNG,
      ].indexOf(file.mimetype as FileMimeTypeEnum) !== -1
    ) {
      isImage = true;
      buffer = await this.compressAndParseImageToJpeg(file.buffer);
    }

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.options.bucketName,
      Key: `${path}/${fileName}`,
      ContentType: isImage ? 'image/jpeg' : file.mimetype,
      Body: buffer,
    };

    let response: ManagedUpload.SendData;

    try {
      const res = new Promise<ManagedUpload.SendData>((resolve, reject) => {
        this.options.s3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
            reject(err.message);
            return null;
          }
          resolve(data);
        });
      });
      response = await res;

      return {
        name: fileName,
        size: isImage ? buffer.length : file.size,
        mime_type: isImage ? 'image/jpeg' : file.mimetype,
        url: response.Location,
        aws_obj: response,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteFile(
    filePath: string,
  ): Promise<S3.Types.DeleteObjectOutput> {
    if (
      filePath.match(/https:\/\/.?\/(.)/) &&
      filePath.match(/https:\/\/.?\/(.)/)[1]
    ) {
      filePath = filePath.match(/https:\/\/.?\/(.)/)[1];
    }

    const params: S3.Types.DeleteObjectRequest = {
      Bucket: this.options.bucketName,
      Key: filePath,
    };

    let response: S3.Types.DeleteObjectOutput;

    try {
      const res = new Promise<S3.Types.DeleteObjectOutput>(
        (resolve, reject) => {
          this.options.s3
            .deleteObject(params, (err, data) => {
              if (err)
                console.log(err, err.stack); // an error occurred
              else {
                resolve(data);
              }
            })
            .on('error', (err) => {
              reject(err);
            });
        },
      );
      response = await res;
    } catch (error) {
      throw new Error(error);
    }
    return response;
  }
}
