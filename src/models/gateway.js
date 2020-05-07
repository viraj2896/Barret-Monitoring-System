const mongoose = require('mongoose')

const gatewaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    ip: {
        type: String,
        required: true,
        trim: true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    }
}, {
    timestamps: true
})

const Gateway = mongoose.model('Gateway', gatewaySchema)

module.exports = Gateway