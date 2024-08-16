import { IUserDocument } from '@user/interfaces/user'
import { UserModel } from '@user/models/user'

export const userService = () => {
  const add = async (data: IUserDocument): Promise<void> => {
    await UserModel.create(data)
  }

  return {
    addUser: add,
  }
}
