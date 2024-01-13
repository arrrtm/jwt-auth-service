require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api/v1', router);
app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => console.log(`Auth Service is started | PORT: ${PORT}`))

    } catch (error) {
        console.log(error)
    }
}

start()