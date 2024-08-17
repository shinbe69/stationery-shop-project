const express = require('express')
const router = express.Router()
const path = require('path')
const { ObjectId } = require('mongodb')
const Order = require('../models/Order')
const User = require('../models/User')

//Get Orders
router.get('/',  (req, res) => {
        Order.find()
        .sort({ createAt: 'descending' })
        .then(products => {
            res.json(products)
        })
        .catch(error => console.log(error))
})
//Get a order(s) with specific id(s)
router.post('/getOrders', (req, res) => {
    Order.find({_id : req.body.orderID})
    .then(orders => {
        res.json(orders)
    })
    .catch(error => console.log(error))
})
//Create an order
router.post('/', (req, res) => {
    let phone = req.body.phone
    let items = req.body.items
    let value = req.body.value
    let address = req.body.address
    if (typeof items !== 'undefined' && typeof value !== 'undefined' && typeof phone !== 'undefined') {
        Order.create({ items, value, phone })
        .then(order => {
            res.json(order._id)
        })
        .catch(error => console.log(error))
    }
    else {
        res.sendStatus(400)
    }
})
//Update order
router.patch('/', (req, res) => {
    let orderID = req.body.orderID
    let phone = req.body.phone
    let address = req.body.address
    let status = req.body.status

    if (!orderID || !phone || !address || !status) {
        res.sendStatus(400)
    }
    else {
        Order.findOne({ _id: orderID })
        .then(order => {
                order.updateOne({ phone, address, status })
                .then(() => res.sendStatus(200))
                .catch(error => console.log(error))
            }
        ).catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
    }
})

module.exports = router