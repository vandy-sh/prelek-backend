import { BadRequestException } from '@nestjs/common';

/**
 * Image Validator
 * Used to validate image file.
 * @param file Image file to be validated.
 * @returns {Promise<boolean>} True if valid image file / Throw exception if not valid.
 */
export function imageValidator(file: Express.Multer.File): boolean {
  const mimetype = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  const maxSize = 3 * 1024 * 1024; // 5MB
  if (mimetype.includes(file.mimetype)) {
    if (file.size > maxSize) {
      throw new BadRequestException('Image size is too large!');
    }
    return true;
  }
  throw new BadRequestException('Only image files are allowed!');
}
