import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import mime from 'mime-types';
import { FileMimeTypeEnum } from '../../../core/enums/allowed-filetype.enum';
import {
  validateFileExtension,
  validateFileSize,
} from '../../../core/utils/file-validation';
import { imageValidator } from '../../../core/utils/image-validator';
import { uploadFileNameParser } from '../../../core/utils/upload-filename-parser';
import { decodeBase64File } from '../utils/decode-base64.util';

@Injectable()
export class AwsS3Service {
  private s3: S3;
  private bucket: string;
  private nodeEnv: string;
  private readonly logger = new Logger(AwsS3Service.name);
  constructor(private readonly configService: ConfigService) {
    this.nodeEnv = this.configService.get('app.nodeEnv') as string;
    const accessKeyId = this.configService.get('awsS3.accessKeyId') as string;
    const secretAccessKey = this.configService.get(
      'awsS3.secretAccessKey',
    ) as string;
    const region = this.configService.get('awsS3.region') as string;
    const endpoint = this.configService.get('awsS3.endpoint') as string;
    this.bucket = this.configService.get('awsS3.bucketName') as string;

    this.s3 = new S3({
      accessKeyId,
      secretAccessKey,
      region,
      endpoint,
    });
  }

  public async uploadFile(
    file: Express.Multer.File,
    FileMimeTypeEnum: FileMimeTypeEnum[],
    path?: string,
  ) {
    validateFileExtension(file, FileMimeTypeEnum);
    validateFileSize(file);

    let fileName = uploadFileNameParser(file.originalname);

    if (path) {
      fileName = path + '/' + fileName;
    }

    // if nodeEnv !== "production", add prefix "dev" to path
    if (this.nodeEnv !== 'production') {
      fileName = `${this.nodeEnv}/` + fileName;
    }

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.bucket,
      Key: fileName,
      ContentType: file.mimetype,
      // ACL: 'public-read',
      Body: file.buffer,
    };

    let response: ManagedUpload.SendData;
    try {
      const res = new Promise<ManagedUpload.SendData>((resolve, reject) => {
        this.s3
          .upload(params, (err, data) => {
            if (err) {
              console.log(err);
              reject(err.message);
              return null;
            }
            resolve(data);
          })
          .on('httpUploadProgress', ({ loaded, total }) => {
            console.log(
              `Uploading ${fileName} to ${params.Bucket} bucket Progress:`,
              loaded,
              '/',
              total,
              `${Math.round((100 * loaded) / total)}%`,
            );
          });
      });
      response = await res;
    } catch (error) {
      throw new Error(error);
    }

    return response;
  }

  async uploadFileOrBase64(
    fileObject: string | Express.Multer.File,
    folderName: string,
  ) {
    let fileBuffer: Buffer;
    let mimeType: string;
    let fileName: string;
    let extension: string;
    // let size: number;

    const timestamp = new Date().getTime();

    if (typeof fileObject === 'string') {
      const decodedFile = decodeBase64File(fileObject);
      fileBuffer = decodedFile.data;
      mimeType = decodedFile.type;
      extension = mime.extension(mimeType) || '';
      // size = fileBuffer.byteLength;
      fileName = `${timestamp}.${extension}`;
      // console.log('string', fileName);
    } else if (typeof fileObject === 'object') {
      fileBuffer = fileObject.buffer;
      mimeType = fileObject.mimetype;
      extension = mime.extension(mimeType) || '';
      // size = fileBuffer.byteLength;Learn more about JS/TS refactorings

      fileName = `${timestamp}.${extension}`;
      // console.log('testing', fileName);
    }

    let destination = folderName ? `${folderName}/${fileName}` : fileName;

    if (this.nodeEnv !== 'production') {
      destination = `${this.nodeEnv}/` + destination;
    }

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('awsS3.bucketName') as string,
      Key: destination,
      ContentType: mimeType,
      // ACL: 'public-read',
      Body: fileBuffer,
    };

    let response: ManagedUpload.SendData;
    try {
      const res = new Promise<ManagedUpload.SendData>((resolve, reject) => {
        this.s3
          .upload(params, (err, data) => {
            if (err) {
              console.log(err);
              reject(err.message);
              return null;
            }
            resolve(data);
          })
          .on('httpUploadProgress', ({ loaded, total }) => {
            console.log(
              `Uploading ${fileName} to ${params.Bucket} bucket Progress:`,
              loaded,
              '/',
              total,
              `${Math.round((100 * loaded) / total)}%`,
            );
          });
      });
      response = await res;
    } catch (error) {
      throw new Error(error);
    }

    return response;
  }

  async uploadFileBase64(base64: string, fileName: string, folderName: string) {
    let fileBuffer: Buffer;
    let mimeType: string;
    let extension: string;

    const timestamp = new Date().getTime();
    const decodedFile = decodeBase64File(base64);
    fileBuffer = decodedFile.data;
    mimeType = decodedFile.type;
    extension = mime.extension(mimeType) || '';
    fileName =
      fileName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10) + timestamp;

    let destination = folderName
      ? `${folderName}/${fileName}.${extension}`
      : `${fileName}.${extension}`;

    if (this.nodeEnv !== 'production') {
      destination = `${this.nodeEnv}/` + destination;
    }

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('awsS3.bucketName') as string,
      Key: destination,
      ContentType: mimeType,
      // ACL: 'public-read',
      Body: fileBuffer,
    };

    let response: ManagedUpload.SendData;
    try {
      const res = new Promise<ManagedUpload.SendData>((resolve, reject) => {
        this.s3
          .upload(params, (err, data) => {
            if (err) {
              console.log(err);
              reject(err.message);
              return null;
            }
            resolve(data);
          })
          .on('httpUploadProgress', (progress) => {
            this.logger.debug(
              `Uploading ${fileName}.${extension} to ${params.Bucket} bucket`,
              // Math.round((progress.loaded / progress.total) * 100) + '% done',
            );
          });
      });
      response = await res;
    } catch (error) {
      throw new Error(error);
    }

    if (response)
      this.logger.debug(
        `${fileName}.${extension} upload success, link: ${response.Location}`,
      );
    return response;
  }

  public async uploadImage(
    file: Express.Multer.File,
    path?: string,
  ): Promise<ManagedUpload.SendData> {
    imageValidator(file);

    let fileName = uploadFileNameParser(file.originalname);

    if (path) {
      fileName = path + '/' + fileName;
    }

    if (this.nodeEnv !== 'production') {
      fileName = `${this.nodeEnv}/` + fileName;
    }

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.bucket,
      Key: fileName,
      ContentType: file.mimetype,
      // ACL: 'public-read',
      Body: file.buffer,
    };

    let response: ManagedUpload.SendData;
    try {
      const res = new Promise<ManagedUpload.SendData>((resolve, reject) => {
        this.s3
          .upload(params, (err, data) => {
            if (err) {
              console.log(err);
              reject(err.message);
              return null;
            }
            resolve(data);
          })
          .on('httpUploadProgress', ({ loaded, total }) => {
            console.log(
              `Uploading ${fileName} to ${params.Bucket} bucket Progress:`,
              loaded,
              '/',
              total,
              `${Math.round((100 * loaded) / total)}%`,
            );
          });
      });
      response = await res;
    } catch (error) {
      throw new Error(error);
    }

    return response;
  }

  public async deleteFile(
    filePath: string,
  ): Promise<S3.Types.DeleteObjectOutput> {
    if (
      filePath.match(/https:\/\/.*?\/(.*)/) &&
      filePath.match(/https:\/\/.*?\/(.*)/)[1]
    ) {
      filePath = filePath.match(/https:\/\/.*?\/(.*)/)[1];
    }

    const params: S3.Types.DeleteObjectRequest = {
      Bucket: this.bucket,
      Key: filePath,
    };

    let response: S3.Types.DeleteObjectOutput;

    try {
      this.logger.debug(
        `Deleting ${filePath} from ${params.Bucket} bucket ...`,
      );
      const res = new Promise<S3.Types.DeleteObjectOutput>(
        (resolve, reject) => {
          this.s3
            .deleteObject(params, (err, data) => {
              if (err) console.log(err, err.stack); // an error occurred
              else {
                this.logger.debug(`${filePath} deleted successfully!`);
                resolve(data);
              }
            })
            .on('error', (err) => {
              this.logger.error(err);
              reject(err);
            });
        },
      );
      response = await res;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
    return response;
  }
}
