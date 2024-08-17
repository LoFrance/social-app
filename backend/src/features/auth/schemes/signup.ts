import Joi, { ObjectSchema } from 'joi'

export const signUpSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(12).messages({
    'string.base': 'Username must be a string',
    'string.min': 'Invalid username - too short',
    'string.max': 'Invalid username - too long',
    'string.empty': 'Username is required',
  }),
  password: Joi.string().required().min(6).max(20).messages({
    'string.base': 'Passowrd must be a string',
    'string.min': 'Invalid password - too short',
    'string.max': 'Invalid password - too long',
    'string.empty': 'Passowrd is required',
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid mail',
    'string.empty': 'Email is required',
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'Avatar color is required',
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'Avatar image is required',
  }),
})
