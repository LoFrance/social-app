import HTTP_STATUS from 'http-status-codes';

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export interface IErrorResponse extends IError {
  serializeErrors(): IError;
}

const CustomError = (message: string, statusCode: number, status: string): Error & IErrorResponse => {
  return { serializeErrors: () => {
    return {
    message,
    statusCode: statusCode,
    status: status
  }}, statusCode: statusCode, status: status, ...new Error(message)}
}
export type CustomError = IError & IErrorResponse

export function isCustomError(arg: any): arg is CustomError {
    return (arg as CustomError).serializeErrors !== undefined;
}

export const BadRequestError = (message: string) => {
  const statusCode = HTTP_STATUS.BAD_REQUEST;
  const status = 'error'
  throw CustomError(message, statusCode, status);
}

export const NotFoundError = (message: string) => {
  const statusCode = HTTP_STATUS.NOT_FOUND;
  const status = 'error'
  throw CustomError(message, statusCode, status);
}


