const express = require('express')
const mongoose = require('./db/mongoose')
const hbs = require('hbs')
const path = require('path')
const session = require('express-session')

const User = require('./models/user')
const Organization = require('./models/organization')
const Room = require('./models/room')
const Gateway = require('./models/gateway')
const Sensor = require('./models/sensor')

const userRouter = require('./routers/user')
const organizationRouter = require('./routers/organization')
const roomRouter = require('./routers/room')
const gatewayRouter = require('./routers/gateway')
const sensorRouter = require('./routers/sensor')
const indexRouter = require('./routers/welcome')

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}))

app.use(userRouter)
app.use(organizationRouter)
app.use(gatewayRouter)
app.use(roomRouter)
app.use(sensorRouter)
app.use(indexRouter)

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.listen(port, () => console.log(`App running on port ${port}`))

module.exports = app