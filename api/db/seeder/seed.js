const bcrypt = require('bcrypt')
const salt = 10
const User = require('../../models/User')
const Product = require('../../models/Product')
const Login = require('../../models/Login')
const Category = require('../../models/Category')
const USERS = require('../seeder/seed_data_user')
const PRODUCTS = require('../seeder/seed_data_product')
const CATEGORIES = require('../seeder/seed_data_category')

module.exports = async () => {
    User.create({userName: 'admin', isAdmin: true})
    .then(user => {
        bcrypt.hash(JSON.stringify('123456'), salt, async (err, hash) => {
            if (err) {
                throw err
            }
            else {
                await Login.create({ userID: user._id, password: hash })
            }
        })
    })
    .catch(err => console.log(err))
    await User.create(USERS)
    await Category.create(CATEGORIES)
    await Product.create(PRODUCTS)
    console.log('Seeding successed!')
}