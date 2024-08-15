import Joi, { ObjectSchema } from 'joi'

export const signinInSchema: ObjectSchema = Joi.object().keys({
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
})
