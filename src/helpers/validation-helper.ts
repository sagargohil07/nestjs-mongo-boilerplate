import { BadRequestException } from '@nestjs/common';

/**
 * Utility function for validating incoming data against Joi schemas.
 * Throws a BadRequestException if validation fails.
 * Ensures that default values are applied.
 * @param schema The Joi schema to validate the data against
 * @param data The data to validate
 */
export function validateInput(schema: any, data: any): any {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw new BadRequestException(error.details[0].message);
  }

  // Return validated data with default values applied
  return value;
}
