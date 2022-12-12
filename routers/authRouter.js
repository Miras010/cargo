const Router = require('express')
const authRouter = new Router()
const AuthController = require('../controllers/authController')
const {check} = require('express-validator')
const authMiddleware = require('./../middleware/authMiddleware')
const roleMiddleware = require('./../middleware/roleMiddleware')

authRouter.post('/login', AuthController.login)
authRouter.post('/registration', [
    check('username', 'Имя не должны быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 3 и меньше 10').isLength({min: 3, max: 10}),
], AuthController.registration)
authRouter.get('/users', roleMiddleware(['USER']), AuthController.getUsers)

module.exports = authRouter