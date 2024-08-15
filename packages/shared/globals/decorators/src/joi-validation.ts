import { JoiRequestValidationError, GenericError, BadRequestError } from '@lfapp/shared-globals-handlers'
import { Request } from 'express'
import { ObjectSchema, ValidationResult, ValidationError } from 'joi'

type JoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): JoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async function(...args: any[]) {
      if(!args) throw GenericError('No request received')
      const req: Request = args[0];
      if(!req.body) throw BadRequestError('No body received')
      // validate body with joy
      const { error } = await Promise.resolve(schema.validate(req.body))
      if(error?.details) {
        throw JoiRequestValidationError(error.details[0].message)
      }
      return originalMethod.apply(this, args);
    }
    return descriptor;
  }
}

export const joiMethodValidation = (schema: ObjectSchema): (...args: any[]) => Promise<ValidationResult | ValidationError> => {
  return async (...args: any[]) => {
    if(!args) throw GenericError('No request received')
    const req: Request = args[0];
    console.log('BODY', req.body)
    if(!req.body || !Object.keys(req.body).length) throw BadRequestError('No body received')

    const validation = schema.validate(req.body)

    if(validation.error?.details) {
      throw JoiRequestValidationError(validation.error.details[0].message)
    }
    return validation
  }
}