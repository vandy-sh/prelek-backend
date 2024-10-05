import { FileMimeTypeEnum } from '../enums/allowed-filetype.enum';
import { generateRandomString } from './generate-random-string';

export const generateFileName = (
  originalName: string,
  mimeType: FileMimeTypeEnum,
): string => {
  let mime = mimeType.split('/')[1];

  if (['jpeg', 'jpg', 'webp', 'png'].indexOf(mime) !== -1) {
    mime = 'jpg';
  }

  return (
    originalName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) +
    generateRandomString(5) +
    new Date().getTime() +
    '.' +
    mime
  );
};
