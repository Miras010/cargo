const express = require('express')
const moongose = require('mongoose')
const authRouter = require('./routers/authRouter')
const trackRouter = require('./routers/trackRouter')

const app = express()
app.use(express.json())

app.use('/auth', authRouter)
app.use('/track', trackRouter)
app.get('/', (req, res) => {
    res.end('Welcome to the logistic company!')
})

const PORT = process.env.PORT || 3000

moongose.set('strictQuery', true);

const DB_URL = 'mongodb://127.0.0.1:27017/nodeproject'


async function startApp() {
    try {
        await moongose.connect(DB_URL).then(() => {
            console.log('MongoDB is connected...')
        })
        app.listen(PORT, () => {
            console.log(`App started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

startApp()

