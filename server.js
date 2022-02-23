
const express = require('express');
const apicache = require('apicache');

const app = express();
const port = 3000;

const { validate, dataFetch } = require('./execution.js')

//Cache all routes (Step 4 Bonus)
const cache = apicache.middleware;
app.use(cache('5 minutes'))

//Part 1 - Validation
app.get('/api/ping', validate)

//Part 2 - Data Fetching
app.get(`/api/posts`, dataFetch)

//Proxy host server
app.listen(port, () => {
    console.log("Your server is ready at " + '\x1b[32m' + "http://localhost:" + port + '\x1b[0m');
});


module.exports = {
    app
}