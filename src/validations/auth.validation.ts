import * as Joi from 'joi';

class AuthValidator {
  signInValidation = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
  });

  registerValidation = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    first_name: Joi.string().min(1).max(50).required().messages({
      'string.min': 'First name must be at least 1 character long',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required',
    }),
    last_name: Joi.string().min(1).max(50).required().messages({
      'string.min': 'Last name must be at least 1 character long',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required',
    }),
  });
}

export const authValidator = new AuthValidator();
