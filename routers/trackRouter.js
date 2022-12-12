const Router = require('express')
const TrackController = require('../controllers/trackController')
const authMiddleware = require('./../middleware/authMiddleware')

const trackRouter = new Router()

trackRouter.get('/getAll', authMiddleware, TrackController.getAll)
trackRouter.post('/create', authMiddleware, TrackController.create)
trackRouter.get('/getOne/:id', authMiddleware, TrackController.getOne)
trackRouter.put('/update', authMiddleware, TrackController.updatePost)
trackRouter.post('/delete/:id', TrackController.deleteTrack)

module.exports = trackRouter