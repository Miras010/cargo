const Track = require("../models/Track");

class TrackService {
    async create (trackData) {
        const createdTrack = await Track.create(trackData)
        return createdTrack
    }

    async getAll () {
        const tracks = await Track.find()
        return tracks
    }

    async updateTrack (track) {
        console.log('updating', track)
        if (!track._id) {
            throw new Error('Enter the id')
        }

        const updatedTrack = await Track.findByIdAndUpdate(track._id, track, {new: true})
        return updatedTrack
    }
}

module.exports = new TrackService()