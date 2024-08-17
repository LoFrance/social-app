import { signIn } from '@auth/controllers/signin'
import { signUp } from '@auth/controllers/signup'
import express, { Router } from 'express'

const router: Router = express.Router()

export const authRoutes = () => {
  router.post('/signin', signIn().read)
  router.post('/signup', signUp().create)

  return {
    routes: () => router,
  }
}
