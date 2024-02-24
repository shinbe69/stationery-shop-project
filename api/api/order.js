const express = require('express')
const router = express.Router()
const path = require('path')
const { ObjectId } = require('mongodb')
const Order = require('../models/Order')
const User = require('../models/User')

//Get Products
router.get('/',  (req, res) => {
    if(!req.cookies.isAdmin) {
        Order.find({user: req.cookies.user})
        .then(products => {
            res.json(products)
        })
        .catch(error => console.log(error))
    }
    else {
        Order.find({})
        .then(products => {
            res.json(products)
        })
        .catch(error => console.log(error))
    }
})
//Get a product with specific id(s)
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
//Confirm order
router.patch('/confirmOrder', (req, res) => {
    let orderID = req.body.orderID
    if (!orderID) {
        res.sendStatus(400)
    }
    else {
        Order.findOne({ _id: orderID })
    .then(order => {
        order.updateOne({ status: 'confirmed' })
        .then(() => res.sendStatus(200))
        .catch(error => console.log(error))
    }).catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
    }
})
//Update order
router.patch('/updateOrder', (req, res) => {
    let orderID = req.body.orderID
    let phone = req.body.phone
    let address = req.body.address

    if (!orderID) {
        res.sendStatus(400)
    }
    else {
        Order.findOne({ _id: orderID })
        .then(order => {
            if (!phone || !address) {
                if (order.status !== 'confirmed')
                    order.updateOne({ status: 'confirmed' })
                    .then(() => res.sendStatus(200))
                    .catch(error => console.log(error))
                else res.sendStatus(400)
            }
            else {
                order.updateOne({ phone, address })
                .then(() => res.sendStatus(200))
                .catch(error => console.log(error))
            }
        }).catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
    }
})

module.exports = router