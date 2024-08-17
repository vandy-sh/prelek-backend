import { BadRequestException } from '@nestjs/common';
import { FileMimeTypeEnum } from '../enums/allowed-filetype.enum';

/**
 * Func to validate the allowed file type
 * @param file
 * @param allowed
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateFileExtension(
  file: Express.Multer.File | string,
  allowed: FileMimeTypeEnum[],
): boolean {
  const fileExtension = typeof file === 'string' ? file : file.mimetype;
  if (!allowed.includes(fileExtension as FileMimeTypeEnum)) {
    throw new BadRequestException(
      `File extension ${fileExtension} is not allowed`,
    );
  }
  return true;
}

/**
 * Func to validate file size
 * @param file
 * @param maxSize - optional
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateFileSize(
  file: Express.Multer.File | number,
  maxSize: number = 1024 * 1024 * 30, // 30MB (default)
): boolean {
  const fileSize = typeof file === 'number' ? file : file.size;
  if (fileSize > maxSize) {
    throw new BadRequestException(
      `File size ${fileSize} is larger than ${maxSize} bytes`,
    );
  }
  return true;
}
