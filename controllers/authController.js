const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
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

    async forgotPassword (req, res) {
        try {
            const {username} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь не найден`})
            }
            const resetToken = generateAccessToken(user._id, user.roles)
            let transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: 'elmira-cargo@mail.ru',
                    pass: 'XhyfPL6fbiP9LXmRYUEF',
                },
            })
            await transporter.sendMail({
                from: '"Elmira-cargo" <elmira-cargo@mail.ru>',
                to: user.mail,
                subject: 'Attachments',
                text: 'This message with attachments.',
                html: `
                <h1>Добрый день, ${user.name}!</h1>
                <p>Для сброса пароля перейдите по следующей ссылке:</p>
                <p>http://elmira-cargo.kz/reset/${resetToken}</p>
                
                <p>Если вы не хотите сбрасывать пароль, то проигнорируйте это сообщение!</p>
                `
            })
            return res.status(200).json()
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async resetPassword (req, res) {
        try {
            const {token, password} = req.body
            if (!token) {
                return res.status(400).json({message: 'Ссылки не существует'})
            }
            const { id } = jwt.verify(token, secret)
            const hashedPassword = bcrypt.hashSync(password, 7);

            const user = await User.findByIdAndUpdate(id, {password: hashedPassword})
            console.log(id)

            if (!user) {
                return res.status(400).json({message: `Пользователь не найден`})
            }
            return res.status(200).json()
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }


}

module.exports = new AuthController()