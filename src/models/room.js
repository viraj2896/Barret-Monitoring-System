const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    width: {
        type: String
    },
    length: {
        type: String
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
}, {
    timestamps: true
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room