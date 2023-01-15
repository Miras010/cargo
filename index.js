const express = require('express')
const path = require('path')
const moongose = require('mongoose')
const authRouter = require('./routers/authRouter')
const trackRouter = require('./routers/trackRouter')
const userRouter = require('./routers/userRouter')
const receiptRouter = require('./routers/receiptRouter')
const cors = require('cors');

const app = express()
app.use(express.json())

const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(express.static(path.join(__dirname, 'frontend')))

app.use(cors(corsOptions))
app.use('/api/auth', authRouter)
app.use('/api/track', trackRouter)
app.use('/api/user', userRouter)
app.use('/api/receipt', receiptRouter)
// app.get('/', (req, res) => {
//     res.end('Welcome to the logistic company!')
// })

app.use('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/index.html'))
})

const PORT = process.env.PORT || 80

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

