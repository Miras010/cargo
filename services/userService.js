const User = require("../models/User");
const Track = require("../models/Track");

class UserService {
    async create (data) {
        const createdUser = await User.create(data)
        return createdUser
    }

    async getAll (params) {
        const { page, limit, globalFilter } = params
        let regex = ''
        if (globalFilter !== 'null') {
            regex = new RegExp(globalFilter, 'i')
        }
        const users = await User.find({
            username: {$regex: regex},
        })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const count = await User.count()
        return {
            resp: users,
            totalPages: Math.ceil(count / limit),
            totalCount: count,
            currentPage: page
        }
    }

    async update (user) {
        if (!user._id) {
            throw new Error('Enter the id')
        }
        const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true})
        return updatedUser
    }
}

module.exports = new UserService()