import { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

// Create a new reporty inside an exist namespace, we add currentUser property in Express Request
declare module 'express' {
  export interface Request {
    currentUser?: IAuthPayload // If user is not logged the property doesn't exist
  }
}

export interface IAuthPayload {
  userId: string
  uId: string
  email: string
  username: string
  avatarColor: string
  iat?: number // needs for token
}

// MongoDb Retrieved Schema
export interface IAuthDocument extends Document {
  _id: string | ObjectId
  uId: string
  username: string
  email: string
  password?: string // Maybe we don't need to send Password to the User
  avatarColor: string
  createdAt: Date
  passwordResetToken?: string
  passwordResetExpires?: number | string
  comparePassword(password: string): Promise<boolean>
  hashPassword(password: string): Promise<string>
}

export interface ISignUpData {
  _id: ObjectId
  uId: string
  email: string
  username: string
  password: string
  avatarColor: string
}

export interface IAuthJob {
  value?: string | IAuthDocument
}
