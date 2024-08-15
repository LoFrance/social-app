import { JoiRequestValidationError, GenericError, BadRequestError } from '@lfapp/shared-globals-handlers'
import { Request } from 'express'
import { ObjectSchema } from 'joi'

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