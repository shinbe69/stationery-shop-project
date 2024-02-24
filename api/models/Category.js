const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = new Schema({
    name: String,
    createAt: { type: Date, default: Date.now },
    thumnail: String
})

module.exports = mongoose.model('Category', Category)