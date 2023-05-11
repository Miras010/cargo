const Router = require('express')
const fileRouter = new Router()
const FileController = require('../controllers/fileController')

fileRouter.post('/upload', FileController.uploadFile)

module.exports = fileRouter