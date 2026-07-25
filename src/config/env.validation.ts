import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  PORT: Joi.number().port().required(),

  CLIENT_URL: Joi.string().uri().required(),

  DATABASE_HOST: Joi.string().required(),

  DATABASE_PORT: Joi.number().port().required(),

  DATABASE_USERNAME: Joi.string().required(),

  DATABASE_PASSWORD: Joi.string().required(),

  DATABASE_NAME: Joi.string().required(),

  JWT_SECRET_KEY: Joi.string().min(64).required(),

  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .required(),

  REFRESH_TOKEN_TTL_DAYS: Joi.number().integer().min(1).required(),

  COOKIE_NAME: Joi.string().min(3).required(),
  COOKIE_SECURE: Joi.boolean().required(),
  COOKIE_SAME_SITE: Joi.string().valid('strict', 'lax', 'none').required(),

  // Super Admin
  SUPER_ADMIN_FULL_NAME: Joi.string().required(),

  SUPER_ADMIN_EMAIL: Joi.string().email().required(),

  SUPER_ADMIN_PASSWORD: Joi.string().min(8).required(),
});
