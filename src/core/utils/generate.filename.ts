import { MIME_TYPE } from '../enums/file-mimetype.enum';
import { generateRandomString } from './generate-random-string';

export const generateFileName = (
  originalName: string,
  mimeType: MIME_TYPE,
): string => {
  return (
    originalName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) +
    generateRandomString(5) +
    new Date().getTime() +
    '.' +
    mimeType.split('/')[1]
  );
};
