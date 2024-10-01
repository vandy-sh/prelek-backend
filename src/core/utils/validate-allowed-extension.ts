import { BadRequestException } from '@nestjs/common';
import { FileMimeTypeEnum } from '../enums/allowed-filetype.enum';
// import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';

/**
 * Func to validate the allowed file type
 * @param fileOrMimeType - MulterFile or string
 * @param allowed - MIME_TYPE[]
 * @returns {boolean} - true if allowed
 * @author RDanang (Iyoy)
 */
export function validateAllowedExtension(
  fileOrMimeType: Express.Multer.File | string,
  allowed: FileMimeTypeEnum[],
): boolean {
  const fileExtension =
    typeof fileOrMimeType === 'string'
      ? fileOrMimeType
      : fileOrMimeType.mimetype;

  if (!allowed.includes(fileExtension as FileMimeTypeEnum)) {
    throw new BadRequestException(
      `File extension ${fileExtension} is not allowed, allowed extensions are: ${allowed}`,
    );
  }
  return true;
}

export function validateFileExtension(
  fileOrMimeType: Express.Multer.File | string,
  allowed: FileMimeTypeEnum[],
  fileName?: string,
): boolean {
  try {
    const fileExtension =
      typeof fileOrMimeType === 'string'
        ? fileOrMimeType
        : fileOrMimeType.mimetype;

    if (!allowed.includes(fileExtension as FileMimeTypeEnum)) {
      throw new BadRequestException(
        `File${
          fileName ? `(${fileName})` : ''
        } extension ${fileExtension} is not allowed, allowed extensions are: ${allowed}`,
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
}
