const fs = require('fs')
const File = require('../models/File')

class FileController {
    async uploadFile (req, res) {
        try {
            const file = req.files.file
            let path = `newFiles\\${file.name}`
            console.log('name', file.name)
            file.mv(path)
            const type = file.name.split('.').pop()
            const created = await File.create({
                name: file.name,
                type,
                size: file.size
            })
            res.json(created)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }
}

module.exports = new FileController()