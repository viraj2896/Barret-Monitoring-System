const mongoose = require('mongoose')
const Gateway = require('./gateway')
const Room = require('./room')
const Sensor = require('./sensor')

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

organizationSchema.virtual('gateways', {
    ref: 'Gateway',
    localField: '_id',
    foreignField: 'owner'
})

organizationSchema.virtual('rooms', {
    ref: 'Room',
    localField: '_id',
    foreignField: 'owner'
})

organizationSchema.virtual('sensors', {
    ref: 'Sensor',
    localField: '_id',
    foreignField: 'owner'
})

const Organization = mongoose.model('Organization', organizationSchema)

module.exports = Organization