const express = require('express')
const router = express.Router()
const path = require('path')
const { ObjectId } = require('mongodb')
const Product = require('../models/Product')
const { checkAdmin } = require('./services')
const { error } = require('console')

//Get Products
router.post('/getProducts',  (req, res) => {
    let filter = req.body.filter
    let category = req.body.category
    if (!filter || filter === 'default') {
        Product.find(category ? { category }: {} )
        .then(products => {
            res.json(products)
        })
        .catch(error => console.log(error))
    }
    else {
        switch (filter) {
            case 'increase':
                Product.find(category ? { category }: {} )
                .sort({ price: 'ascending' })
                .then(products => res.json(products))
                .catch(error => {
                    console.log(error)
                    res.sendStatus(500)
                })
                break
            case 'decrease':
                Product.find(category ? { category }: {} )
                .sort({ price: 'descending' })
                .then(products => res.json(products))
                .catch(error => {
                    console.log(error)
                    res.sendStatus(500)
                })
                break
            case 'bestsell':
                Product.find(category ? { category }: {} )
                .sort({ soldQuantity: 'descending' })
                .limit(5)
                .then(products => res.json(products))
                .catch(error => {
                    console.log(error)
                    res.sendStatus(500)
                })
                break
            case 'recently':
                let limit = req.body.limit ? req.body.limit : true
                Product.find(category ? { category }: {} )
                .sort({ createAt: 'descending' })
                .limit(limit)
                .then(products => res.json(products))
                .catch(error => {
                    console.log(error)
                    res.sendStatus(500)
                })
                break
        }
    }

})

//Get a product with specific id(s)
router.post('/getProductsById', (req, res) => {
    Product.find({_id : req.body.productID})
    .then(products => {
        res.json(products)
    })
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
})
//Post a products
router.post('/', (req, res) => {
    let name = req.body.name
    let category = req.body.category
    let description = req.body.description
    let unitPrice = req.body.unitPrice
    let quantity = req.body.quantity
    let thumnail = req.body.thumnail
    let additionalInfo = req.body.additionalInfo || ''
    if (typeof name !== 'undefined' && typeof category !== 'undefined' && typeof description !== 'undefined' && typeof unitPrice !== 'undefined' && typeof quantity !== 'undefined' && typeof thumnail !== 'undefined') {
        Product.create({ name, description, price: unitPrice, thumnail, quantity, category: new ObjectId(category), additionalInfo })
        .then(product => {
            res.json(product)
        })
        .catch(error => console.log(error))
    }
    else {
        res.sendStatus(400)
    }
})

module.exports = router