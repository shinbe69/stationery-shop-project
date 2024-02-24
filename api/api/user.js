const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Order = require('../models/Order')
let totalQuantity

//Get user info 
router.post('/getUser', (req, res) => {
  User.findOne({userName: req.body.username})
  .then(user => {
    res.json(user)
    })
    .catch(error => {
    console.log(error)
    res.sendStatus(400)
  })
})
//Update user info
router.patch('/updateUser', (req, res) => {
  User.findOne({userName: req.body.username})
  .then(user => {
    let address = req.body.address
    let dob = req.body.dob
    let gender = req.body.gender
    let phoneNumber = req.body.phoneNumber
    if (typeof address !== 'undefined' && typeof phoneNumber !== 'undefined') {
      user.updateOne((typeof dob !== 'undefined' && typeof gender !== 'undefined') ? { address, dob, gender, phoneNumber} : { address, phoneNumber})
      .then(user => res.sendStatus(200))
      .catch(error => console.log(error))
    }
    else res.sendStatus(400)
  }).catch(error => {
    console.log(error)
    res.sendStatus(400)
  })
})
//Add item(s) to cart
router.patch('/addToCart', (req, res) => {
  User.findOne({userName: req.body.username})
  .then(user => {
    if (req.body.cart.length === 0) {
      res.json(user.cart)
    }
    else {
      totalQuantity = 0
      let prepareCart = (user.cart.cartItems).concat(req.body.cart).reduce(mergeCart, [])
      user.updateOne({cart: {cartItems: prepareCart, totalQuantity}})
      .then(() => {
          res.json({cartItems: prepareCart, totalQuantity})
      })
      .catch(error => console.log(error))
    }
  })
  .catch(error => console.log(error))
})

//Remove item(s) from cart
router.patch('/removeFromCart', (req, res) => {
  User.findOne({userName: req.body.username})
  .then(user => {
    let quantityOfRemoveItems = 0
    let prepareCart = user.cart.cartItems
    let isRequestValid = true
    req.body.cart.forEach(removeItem => {
      quantityOfRemoveItems -= removeItem.quantity
      let isContain = prepareCart.findIndex((item) => item.id === removeItem.id)
      if (isContain !== -1) {
        if (removeItem.quantity === prepareCart[isContain].quantity)
          prepareCart.splice(isContain, 1)
        else if (removeItem.quantity < prepareCart[isContain].quantity && removeItem.quantity > 0)
          prepareCart[isContain].quantity -= removeItem.quantity
        else
          isRequestValid = false
      }
      else isRequestValid = false
    })
    if (isRequestValid) {
      user.updateOne({cart: {cartItems: prepareCart, totalQuantity: user.cart.totalQuantity + quantityOfRemoveItems}})
      .then(async () => {
          let user = await User.findOne({userName: req.body.username})
          res.json(user.cart)
      })
      .catch(error => console.log(error))
    }
    else res.sendStatus(400)
  })
})


function mergeCart(accumulator, currentValue) {
  let isMerge = false
  totalQuantity += currentValue.quantity
  accumulator.forEach((cartItem) => {
    if (currentValue.id === cartItem.id) {
          cartItem.quantity += currentValue.quantity
          isMerge = true
          return
    }
  })
  if (!isMerge)
    accumulator.push(currentValue)
  return accumulator
}

module.exports = router