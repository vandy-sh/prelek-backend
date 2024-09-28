import { Inject, Injectable } from '@nestjs/common';
import { FileMimeTypeEnum } from '../../../core/enums/allowed-filetype.enum';
import {
  validateFileExtension,
  validateFileSize,
} from '../../../core/utils/file-validation';
import { uploadFileNameParser } from '../../../core/utils/upload-filename-parser';
import { S3 } from 'aws-sdk';
import { AWS_S3_MODULE_OPTIONS, AwsS3ModuleOptions } from '../types';
import { ManagedUpload } from 'aws-sdk/clients/s3';

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

  public async uploadFile(
    file: Express.Multer.File,
    FileMimeTypeEnum: FileMimeTypeEnum[],
    path?: string,
  ): Promise<UploadedFileObj> {
    // validasi extennsion
    validateFileExtension(file, FileMimeTypeEnum);

    // validasi size
    validateFileSize(file);

    // generate name untuk filenya
    let fileName = uploadFileNameParser(file.originalname);

    if (path) {
      fileName = path + '/' + fileName;
    }

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.options.bucketName,
      Key: fileName,
      ContentType: file.mimetype,
      // ACL: 'public-read',
      Body: file.buffer,
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
        mime_type: file.mimetype,
        url: response.Location,
        size: file.size,
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
