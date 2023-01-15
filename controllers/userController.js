const Track = require('../models/Track')
const User = require('../models/User')
const TrackService = require('./../services/trackService')
const UserService = require('./../services/userService')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const Role = require("../models/Role");

class UserController {
    async create (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка регистрации', errors})
            }
            const {username, name, surname, mail, phoneNumber, password, isActive, roles} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            const hashedPassword = bcrypt.hashSync(password, 7);

            let userRoles

            if (roles) {
                userRoles = await Role.findOne({value: roles.value})
                if (!userRoles) {
                    return res.status(400).json({message: 'Роль не существует'})
                }
            } else {
                userRoles = await Role.findOne({value: 'USER'})
            }

            const user = new User({username, name, surname, mail, phoneNumber, password: hashedPassword, isActive, roles: [userRoles.value]})
            await user.save()
            res.status(200).json({message: 'Пользователь успешно создан!'})
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAll (req, res) {
        try {
            const { page = 1, limit = 10, globalFilter = '' } = req.query
            const response = await UserService.getAll({ page, limit, globalFilter})
            res.status(200).json(response)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async loadUsers (req, res) {
        try {
            const { globalFilter = '' } = req.query
            const response = await UserService.loadUsers({ globalFilter })
            res.status(200).json(response)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getOne (req, res) {
        try {
            const track = await User.findById(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async deleteUser (req, res) {
        try {
            const track = await User.findByIdAndDelete(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async updateUser (req, res) {
        try {
            const updated = await UserService.update(req.body)
            res.status(200).json(updated)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

}

module.exports = new UserController()