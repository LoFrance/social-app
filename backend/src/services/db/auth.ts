import { IAuthDocument } from '@auth/interfaces/auth'
import { AuthModel } from '@auth/models/auth'
import { firstLetterUpperCase } from '@lfapp/shared-globals-handlers'

export const authService = () => {
  const getUserByUsernameOrEmail = async (
    username: string,
    email: string
  ): Promise<IAuthDocument | null> => {
    const query = {
      $or: [{ username: firstLetterUpperCase(username) }, { email: email.toLocaleLowerCase() }],
    }
    const user: IAuthDocument | null = await AuthModel.findOne(query).exec()
    return user
  }

  const getAuthUserByUsername = async (username: string): Promise<IAuthDocument> => {
    const user: IAuthDocument = (await AuthModel.findOne({
      username: firstLetterUpperCase(username),
    }).exec()) as IAuthDocument
    return user
  }

  const add = async (data: IAuthDocument): Promise<void> => {
    await AuthModel.create(data)
  }

  return {
    getUserByUsernameOrEmail,
    getAuthUserByUsername,
    addAuthUser: add,
  }
}
