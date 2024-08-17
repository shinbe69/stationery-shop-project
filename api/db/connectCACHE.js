const { createClient } = require('redis')

const client = createClient({
    url: 'redis://CACHE:6379'
})

client.on('error', err => console.log(err))
;(() => {
    client.connect()
})();

module.exports = client