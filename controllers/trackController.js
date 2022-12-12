const Track = require('../models/Track')
const TrackService = require('./../services/trackService')
const jwt = require("jsonwebtoken");
const {secret} = require("../config");

class TrackController {
    async create (req, res) {
        try {
            const {trackNumber, status} = req.body
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: 'Не авторизован'})
            }
            const {id} = jwt.verify(token, secret)
            const track = await TrackService.create({trackNumber, status, createdBy: id})
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAll (req, res) {
        try {
            const posts = await TrackService.getAll()
            res.status(200).json(posts)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getOne (req, res) {
        try {
            const track = await Track.findById(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async deleteTrack (req, res) {
        try {
            const track = await Track.findByIdAndDelete(req.params.id)
            res.status(200).json(track)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async updatePost (req, res) {
        try {
            const updatedTrack = await TrackService.updateTrack(req.body)
            res.status(200).json(updatedTrack)
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

module.exports = new TrackController()