import express, { Application } from 'express'

const router = express.Router()

// dall'esempio della guida di Express
router.use(function timeLog(req, res, next) {
  const currentDate = new Date()
  console.log(
    `Ricevuta chiamata :: ${currentDate.getDay()}/${currentDate.getMonth()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`,
  )
  next()
})

export default (app: Application) => {
  const routes = () => {
    app.use(router)
  }
  routes()
}
