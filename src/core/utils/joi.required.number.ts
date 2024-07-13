import * as Joi from 'joi';

export const baseJoiRequiredNumber = (fieldName: string, minValue = 1) => {
  // validate number
  return Joi.number()
    .min(minValue) // Enforce that the number must be greater than or equal to the specified minValue
    .required()
    .error((errors: any) => {
      errors.forEach((err: any) => {
        switch (err.code) {
          case 'any.required':
            err.message = `${fieldName} is required`;
            break;
          case 'number.base':
            err.message = `${fieldName} must be a number`;
            break;
          case 'number.min':
            err.message = `${fieldName} must be greater than or equal to ${minValue}`;
            break;
          default:
            break;
        }
      });
      return errors;
    });
};
