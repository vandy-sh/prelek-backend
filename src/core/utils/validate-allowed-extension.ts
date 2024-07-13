import { BadRequestException } from '@nestjs/common';
// import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { MIME_TYPE } from '../enums/file-mimetype.enum';

/**
 * Func to validate the allowed file type
 * @param fileOrMimeType - MulterFile or string
 * @param allowed - MIME_TYPE[]
 * @returns {boolean} - true if allowed
 * @author RDanang (Iyoy)
 */
export function validateAllowedExtension(
  fileOrMimeType: Express.Multer.File | string,
  allowed: MIME_TYPE[],
): boolean {
  const fileExtension =
    typeof fileOrMimeType === 'string'
      ? fileOrMimeType
      : fileOrMimeType.mimetype;

  if (!allowed.includes(fileExtension as MIME_TYPE)) {
    throw new BadRequestException(
      `File extension ${fileExtension} is not allowed, allowed extensions are: ${allowed}`,
    );
  }
  return true;
}

export function validateFileExtension(
  fileOrMimeType: Express.Multer.File | string,
  allowed: MIME_TYPE[],
  fileName?: string,
): boolean {
  try {
    const fileExtension =
      typeof fileOrMimeType === 'string'
        ? fileOrMimeType
        : fileOrMimeType.mimetype;

    if (!allowed.includes(fileExtension as MIME_TYPE)) {
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
