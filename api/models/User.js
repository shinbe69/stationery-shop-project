const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    userName: String,
    dob: {type: Date, default: null},
    cart: {
        cartItems: {type: Object, default: []},
        totalQuantity: {type: Number, default: 0}
    },
    isAdmin: {type: Boolean, default: false},
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    gender: { type: String, default: '' },
    createAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', User)