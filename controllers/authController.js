const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const {secret} = require('../config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class AuthController {
    async registration (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка регистрации', errors})
            }
            const {username, name, surname, mail, phoneNumber, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            const hashedPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, name, surname, mail, phoneNumber, password: hashedPassword, roles: [userRole.value]})
            await user.save()
            res.status(200).json({message: 'Пользователь успешно создан!'})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async login (req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            if (!user.isActive) {
                const roles = user.roles
                let isAdmin = false
                roles.forEach(role => {
                    if(role === 'ADMIN') {
                        isAdmin = true
                    }
                })
                if (!isAdmin) {
                    return res.status(400).json({message: `Пользователь ${username} не активирован`})
                }
            }
            console.log('uisactove', user.isActive)
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Введен неправильный пароль'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.status(200).json({token, roles: user.roles, userInfo: user})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async getUsers (req, res) {
        try {
            const users = await User.find()
            res.status(500).json({users})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

}

module.exports = new AuthController()