const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')
const postRouter = require('./controllers/post')
const userRouter = require('./controllers/author')
const loginRouter = require('./controllers/login')
const app = express()
const config = require('./utils/config')

mongoose.connect(config.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

app.use(cors())
app.use(express.json())
app.use('/api/posts', postRouter)
app.use('/api/authors', userRouter)
app.use('/api/login', loginRouter)

module.exports = app
