const {faker} = require('@faker-js/faker')

function createRandomUser() {
    return {
        userName: faker.internet.userName(),
        dob: faker.date.birthdate(),
        phoneNumber: faker.phone.number(),
        gender: faker.person.gender()
    }
}

module.exports = faker.helpers.multiple(createRandomUser, {
    count: 5
})