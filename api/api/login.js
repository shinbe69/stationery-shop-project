const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
require('dotenv').config({ path: '../.env' })
const salt = 10
const Login = require('../models/Login')
const User = require('../models/User')
const { generateJWT } = require('./services')

//Login
router.post('/login', async (req,res) => {
    let inputID = req.body.username

    let user = await User.find({ userName: inputID })
    //if the id user submit is not exist in database, response 400
    if (typeof user[0] === 'undefined') {
        res.sendStatus(400)
    }
    //otherwise, check if password user submit is correct
    else {
        const password = JSON.stringify(req.body.password)
        const hashPassword = (await Login.find({ userID: user[0]._id }))[0].password
        bcrypt.compare(password, hashPassword, (err, isCorrect) => {
            if (err) throw err
            if (isCorrect) {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.cookie('JWT', generateJWT({username: inputID, userID: user[0]._id}), { httpOnly: true, maxAge: 60*60*24*1000 })
                res.cookie('user', inputID, { maxAge: 60*60*24*1000 })
                user[0].isAdmin ? res.cookie('isAdmin', true, { maxAge: 60*60*24*1000 }) : {}
                res.sendStatus(200)
            }
            else res.sendStatus(400)
        })
    }
})
//Sign up
router.post('/signup', async (req,res) => {
    let userName = req.body.username
    let password = req.body.password
    if (typeof userName !== 'undefined' && typeof password !== 'undefined') {
        let user = await User.find({ userName })
        if (typeof user[0] === 'undefined') {
            bcrypt.hash(JSON.stringify(req.body.password), salt, async (err, hash) => {
                if (err) {
                    res.sendStatus(500)
                    throw err
                }
                else {
                    user = await User.create({userName})
                    if (user) {
                        if (await Login.create({ userID: user._id, password: hash }))
                            res.json(user)
                        else
                            res.sendStatus(500)
                    }
                }
            })
        }
        else res.sendStatus(409)
    }
    else res.sendStatus(400)
})
//Log out
router.post('/logout', (req, res) => {
    res.clearCookie('JWT')
    res.clearCookie('user')
    res.sendStatus(200)
})

module.exports = router