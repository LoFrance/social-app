import { ServerError } from '@lfapp/shared-globals-handlers'
import { IUserDocument } from '@user/interfaces/user'
import { UserModel } from '@user/models/user'
import mongoose from 'mongoose'

const aggregateProject = () => {
  // To return data as we want
  return {
    _id: 1,
    username: '$authId.username',
    uId: '$authId.uId',
    email: '$authId.email',
  }
}

export const userService = () => {
  const add = async (data: IUserDocument): Promise<void> => {
    await UserModel.create(data)
  }

  const getUserByAuthId = async (authId: string) => {
    const users: Array<IUserDocument> = await UserModel.aggregate([
      { $match: { authId: new mongoose.Types.ObjectId(authId) } },
      // from Auth with look inside _id the value of local authId User Model Schema and return as authId
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
      // lookup return a lists but with unwind we return an object
      { $unwind: '$authId' },
      { $project: aggregateProject() },
    ])

    if (users === undefined || users.length <= 0) {
      throw ServerError('Cannot find User in Auth')
    }
    return users[0]
  }

  return {
    addUser: add,
    getUserByAuthId,
  }
}
