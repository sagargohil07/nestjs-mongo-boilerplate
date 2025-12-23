import * as Joi from 'joi';

class UserValidator {
  registerValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    country_code: Joi.string().optional(),
    phone_number: Joi.string().optional(),
  });

  loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  updateUserProile = Joi.object({
    first_name: Joi.string().min(1).max(50).optional(),
    last_name: Joi.string().min(1).max(50).optional(),
    phone_number: Joi.string().optional(),
    image: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    zip: Joi.string().optional(),
    lat: Joi.string().optional(),
    long: Joi.string().optional(),
    country_code: Joi.string().optional(),
    language: Joi.string().optional(),
    currency: Joi.string().optional(),
    is_auto_location: Joi.boolean().optional(),
    time_zone: Joi.string().optional(),
    fb_link: Joi.string().uri().optional(),
    instagram_link: Joi.string().uri().optional(),
  });

  createUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(1).max(50).required(),
    last_name: Joi.string().min(1).max(50).required(),
  });

  updateUserValidation = Joi.object({
    email: Joi.string().email().optional(),
    first_name: Joi.string().min(1).max(50).optional(),
    last_name: Joi.string().min(1).max(50).optional(),
  });
}

export const userValidator = new UserValidator();
