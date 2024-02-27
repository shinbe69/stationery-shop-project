const {faker} = require('@faker-js/faker')

function createRandomCategory() {
    return {
        name: faker.commerce.product(),
        thumnail: faker.image.urlLoremFlickr({
            category: 'garden'
        })
    }
}

module.exports = faker.helpers.multiple(createRandomCategory, {
    count: 5
})