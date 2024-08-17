import Joi, { ObjectSchema } from 'joi'

export const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid mail',
    'string.empty': 'Email is required',
  }),
})

export const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(6).max(20).messages({
    'string.base': 'Passowrd must be a string',
    'string.min': 'Invalid password - too short',
    'string.max': 'Invalid password - too long',
    'string.empty': 'Passowrd is required',
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passowrd should match',
    'any.required': 'Confirm passowrd is required',
  }),
})
