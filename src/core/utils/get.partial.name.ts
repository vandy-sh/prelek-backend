import { BadRequestException } from '@nestjs/common';

export type PartialName = {
  first_name: string;
  middle_name: string;
  last_name: string;
};

export const getPartialName = (fullName: string): PartialName => {
  const words = fullName.split(' ');

  if (words.length === 1) {
    const [first_name] = words;
    return {
      first_name,
      middle_name: '',
      last_name: '',
    };
  } else if (words.length === 2) {
    const [first_name, last_name] = words;
    return {
      first_name,
      middle_name: '',
      last_name,
    };
  } else if (words.length > 2) {
    const [first_name, ...middle_name] = words;
    const last_name = middle_name.pop() as string;
    return {
      first_name,
      middle_name: middle_name.join(' '),
      last_name,
    };
  } else {
    // Handle the case where the full name is not long enough
    throw new BadRequestException('Invalid full name format');
  }
};
