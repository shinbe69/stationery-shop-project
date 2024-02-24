const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Login = new Schema({
    userID: ObjectId,
    password: String,
    updateAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Login', Login)