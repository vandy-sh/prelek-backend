import * as Joi from 'joi';

export const baseJoiRequiredBoolean = (fieldName: string) => {
  // validate number
  return Joi.boolean()
    .required()
    .error((errors: any) => {
      errors.forEach((err: any) => {
        switch (err.code) {
          case 'any.required':
            err.message = `${fieldName} is required`;
            break;
          case 'boolean.base':
            err.message = `${fieldName} must be a boolean`;
            break;
          default:
            break;
        }
      });
      return errors;
    });
};
