const {faker} = require('@faker-js/faker')

function createRandomProduct() {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 1000, max: 300000 }),
        thumnail: faker.image.urlLoremFlickr({
            category: 'plant'
        }),
        quantity: faker.number.int({min: 1, max: 30}),
        soldQuantity: faker.number.int({min: 0, max: 100})
    }
}

module.exports = faker.helpers.multiple(createRandomProduct, {
    count: 10
})