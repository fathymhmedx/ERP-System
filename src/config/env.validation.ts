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

  JWT_SECRET_KEY: Joi.string().min(32).required(),

  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .required(),
  JWT_REFRESH_SECRET_KEY: Joi.string().min(32).required(),

  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .required(),
});
