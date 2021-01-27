const axios = require('axios')

// other common request settings can go here, e.g. interceptors, timeouts etc
const http = axios.create({
  baseURL: process.env.POLICE_API_URL
})

module.exports = http
