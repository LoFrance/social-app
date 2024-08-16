import { compare, hash } from 'bcryptjs'
import { IAuthDocument } from '@auth/interfaces/auth'
import { model, Model, Schema } from 'mongoose'
import { ServerError } from '@lfapp/shared-globals-handlers'

const SALT_ROUND = 10 // For hashing password

// MongoDB Schema: id is automatically generated for us
const authSchema: Schema = new Schema(
  {
    username: { type: String },
    uId: { type: String },
    email: { type: String },
    password: { type: String },
    avatarColor: { type: String },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: '' },
    passwordResetExpires: { type: Number },
  },
  {
    // We don't wanna to retrieve the password to the request so we delete a property
    toJSON: {
      transform(_doc, ret) {
        delete ret.password
        return ret
      },
    },
  }
)

// Hooks: Pre-Save - we hashing password before save document
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  try {
    const hashedPassword: string = await hash(this.password as string, SALT_ROUND)
    this.password = hashedPassword
    next()
  } catch (e) {
    throw ServerError(`Bcrypt error: ${JSON.stringify(e)}`)
  }
})

// Methods

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IAuthDocument).password!
  return compare(password, hashedPassword)
}

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND)
}

export const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth')
