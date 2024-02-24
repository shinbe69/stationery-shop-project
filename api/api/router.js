const express = require('express')
const router = express.Router()
const path = require('path')
const user = require('./user')
const product = require('./product')
const login = require('./login')
const order = require('./order')
const Category = require('../models/Category')
const { checkToken, checkAdmin } = require('../api/services')
const Product = require('../models/Product')

router.use('/api/products', product)
router.use('/api/users', checkToken, user)
router.use('/api/orders', order)
router.use('/api/auth', login)

router.get('/api/category', (req, res) => {
    Category.find({})
    .then(categories => res.json(categories))
    .catch(error => console.log(error))
})

router.post('/api/category', async (req, res) => {
    let name = req.body.name
    let thumnail = req.body.thumnail
    if (typeof name !== 'undefined' && typeof thumnail !== 'undefined') {
        let category = await Category.findOne({ name })
        if (!category) {
            Category.create({ name, thumnail })
            .then(() => res.sendStatus(200))
            .catch(err => {
                console.log(err)
            })
        }
        else res.sendStatus(409)
    }
    else res.sendStatus(400)
})
//Search API
router.post('/api/search', async (req, res) => {
    // let result = await Product.find({ name: { $regex: (req.query.searchInput).toString(), $options: 'ix' }})
    let results = []
    let products = await Product.find()
    let searchKey = req.body.searchInput
    products.forEach(product => {
        if ((product.name).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(searchKey))
            results.push(product)
    })
    res.json(results)
})

module.exports = router