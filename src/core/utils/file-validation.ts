import { BadRequestException } from '@nestjs/common';
import { FileMimeTypeEnum } from '../enums/allowed-filetype.enum';
import { convertBytesToMB } from './bytes-to-mb-converter';

/**
 * Func to validate the allowed file type
 * @param file
 * @param allowed
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateFileExtension(
  file: Express.Multer.File,
  allowed: FileMimeTypeEnum[],
): boolean {
  try {
    if (!allowed.includes(file.mimetype as FileMimeTypeEnum)) {
      throw new BadRequestException(
        `File ${file.originalname} extension ${file.mimetype} is not allowed, allowed extensions are: ${allowed}`,
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Func to validate file size
 * @param file
 * @param maxSize - optional
 * @returns {boolean}
 * @author RDanang (Iyoy)
 */
export function validateFileSize(
  file: Express.Multer.File,
  maxSize?: number,
): boolean {
  try {
    const max = maxSize ? maxSize : 1024 * 1024 * 5; // default is 5MB

    if (file.size > max) {
      throw new BadRequestException(
        `File ${file.originalname} size ${convertBytesToMB(file.size)} is larger than ${convertBytesToMB(max)} bytes`,
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
}
