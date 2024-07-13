export type DecodedLoginId = {
  phone_number: string;
  email: string;
};

export const decodeLoginId = (loginId: string): DecodedLoginId => {
  const phone_number: string = /^\+?(\d{1,4})?[.-]?\d{1,15}$/.test(loginId)
    ? loginId
    : '';
  const email: string = /^\S+@\S+\.\S+$/.test(loginId) ? loginId : '';

  return { phone_number, email };
};
