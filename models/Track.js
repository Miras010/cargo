const {Schema, model, ObjectId} = require('mongoose')

const Track = new Schema({
    trackNumber: {type: String, unique: true, required: true},
    status: {type: String, required: true},
    createdDate: {type: Date, default: Date.now, required: true},
    updatedDate: {type: Date, default: Date.now },
    createdBy: {type: ObjectId, required: true, ref: 'User'},
})

module.exports = model('Track', Track)