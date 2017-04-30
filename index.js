'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const giphinateHandler = require('./lib/handlers/giphinate')
const app = express()
const port = process.env.PORT || 8000

app
.use(bodyParser.json())
.get('/:queryText', giphinateHandler)

.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
