const {Schema, model, ObjectId} = require('mongoose')

const File = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    size: {type: String},
    createdDate: {type: Date, default: Date.now, required: true},
})

module.exports = model('File', File)