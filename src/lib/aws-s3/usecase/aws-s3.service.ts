import { Inject, Injectable } from '@nestjs/common';

import sharp from 'sharp';
import { AWS_S3_MODULE_OPTIONS, AwsS3ModuleOptions } from '../types';
import {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { FileMimeTypeEnum } from '../../../core/enums/allowed-filetype.enum';
import { generateFileName } from '../../../core/utils/generate.filename';
import {
  validateFileExtension,
  validateFileSize,
} from '../../../core/utils/file-validation';
import { Upload } from '@aws-sdk/lib-storage';

export class UploadedFileObj {
  name: string;
  size: number;
  mime_type: string;
  url: string;
  path: string;
  aws_obj: CompleteMultipartUploadCommandOutput;
}
@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(AWS_S3_MODULE_OPTIONS)
    private readonly options: AwsS3ModuleOptions,
  ) {}
  removeDomainNameFromUrl(path: string): string {
    const match = path.match(/https:\/\/[^\/]+\/(.+)/); // Modified regex
    if (match && match[1]) {
      path = match[1];
    }
    return path;
  }

  async compressAndParseImageToJpeg(buffer: Buffer): Promise<Buffer> {
    // Compress and convert the image to JPEG format using sharp
    // console.log('Compressing image...');
    // console.log('buffer: ', buffer);
    const compressedImage = await sharp(buffer)
      .resize({ width: 800 }) // Resize the image to a width of 800px, keeping aspect ratio
      .jpeg({ quality: 80 }) // Compress the image and convert it to JPEG with 80% quality
      .toBuffer(); // Convert the processed image to a Buffer
    return compressedImage;
  }

  public async uploadFile(
    file: Express.Multer.File,
    uploadPath: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 5, // 5 mb by default
  ): Promise<UploadedFileObj> {
    const fileName = generateFileName(
      file.originalname,
      file.mimetype as FileMimeTypeEnum,
    );

    validateFileExtension(file, AllowedFileTypes);
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

    const finalPath = `${uploadPath}/${fileName}`;

    const params: PutObjectCommandInput = {
      Bucket: this.options.bucketName,
      Key: finalPath,
      ContentType: isImage ? 'image/jpeg' : file.mimetype,
      Body: buffer,
    };

    try {
      const parallelUploads3 = new Upload({
        client: this.options.s3,
        params,
        // (optional) concurrency configuration
        queueSize: 10,
        // (optional) size of each part, in bytes, at least 5MB
        partSize: 1024 * 1024 * 5,
        // (optional) when true, do not automatically call AbortMultipartUpload when
        // a multipart upload fails to complete. You should then manually handle
        // the leftover parts.
        leavePartsOnError: false,
      });

      // let totalUploadedParts = 1;
      // let totalParts = Math.ceil(buffer.length / (1024 * 1024 * 5));
      parallelUploads3.on('httpUploadProgress', (progress) => {
        // console.log(
        //   `progress - ${progress.loaded}/${progress.total}, processing part: ${progress.part}, uploaded part [${totalUploadedParts}/${totalParts}]`,
        // );
        // console.log(progress);
        // totalUploadedParts++;
      });

      const response = await parallelUploads3.done();
      // console.dir(response, { depth: null });
      // console.log(response.Location);

      return {
        name: fileName,
        mime_type: file.mimetype,
        url: response.Location!,
        size: file.size,
        path: finalPath,
        aws_obj: response,
      };
    } catch (error) {
      console.dir(error);
      throw error;
    }
  }

  public async deleteFile(
    paths: string[],
  ): Promise<DeleteObjectsCommandOutput> {
    const newPath = paths.map((path) => {
      return {
        Key: this.removeDomainNameFromUrl(path),
      };
    });

    console.log(`deleting files: ${JSON.stringify(newPath)}`);

    const command = new DeleteObjectsCommand({
      Bucket: this.options.bucketName,
      Delete: {
        Objects: newPath,
      },
    });

    try {
      const response = await this.options.s3.send(command);
      console.log('delete response');
      console.dir(response, { depth: null });
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
