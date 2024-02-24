const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Blog = new Schema({
    title: String,
    thumnail: String,
    description: String,
    content: String,
    createAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Blog', Blog)