const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = new Schema({
    items: {type: Object},
    status: { type: String, default: 'unconfirmed' },
    value: Number,
    isPaid: { type: Boolean, default: false },
    address: String,
    phone: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', Order)