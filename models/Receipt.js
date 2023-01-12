const {Schema, model, ObjectId} = require('mongoose')

const Receipt = new Schema({
    receiver: {type: ObjectId, required: true, ref: 'User'},
    weight: {type: String, required: true},
    totalSum: {type: Number, required: true},
    totalNumber: {type: Number, required: true},
    createdBy: {type: ObjectId, ref: 'User'},
})

module.exports = model('Receipt', Receipt)