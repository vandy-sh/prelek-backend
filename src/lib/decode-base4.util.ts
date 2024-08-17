import { DecodeBase64Dto } from './decode-base64.dto';

export function decodeBase64File(dataString: string): DecodeBase64Dto {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const result: DecodeBase64Dto = new DecodeBase64Dto();

  if (matches.length !== 3) {
    throw new Error('Invalid input string');
  }

  result.type = matches[1];
  result.data = Buffer.from(matches[2], 'base64');

  return result;
}
