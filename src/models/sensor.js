const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String
    },
    room : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    gateway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gateway',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
}, {
    timestamps: true
})

const Sensor = mongoose.model('Sensor', sensorSchema)

module.exports = Sensor