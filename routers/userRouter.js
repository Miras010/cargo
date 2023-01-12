const Router = require('express')
const UserController = require('../controllers/userController')
const roleMiddleware = require('./../middleware/roleMiddleware')
const {check} = require("express-validator");

const userRouter = new Router()

userRouter.get('/getAll', roleMiddleware(['ADMIN']), UserController.getAll)
userRouter.post('/create', [
    check('name', 'Имя не должен быть пустым').notEmpty(),
    check('surname', 'Фамилия не должен быть пустым').notEmpty(),
    check('mail', 'Почта не должен быть пустым').notEmpty(),
    check('phoneNumber', 'Номер не должен быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 3 и меньше 10').isLength({min: 3, max: 10}),
], roleMiddleware(['ADMIN']), UserController.create)
userRouter.get('/getOne/:id', roleMiddleware(['ADMIN']), UserController.getOne)
userRouter.put('/update', roleMiddleware(['ADMIN']), UserController.updateUser)
userRouter.post('/delete/:id', roleMiddleware(['ADMIN']), UserController.deleteUser)

module.exports = userRouter