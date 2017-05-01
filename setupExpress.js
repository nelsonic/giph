const express = require('express')
const bodyParser = require('body-parser')
const logger = require('menna')
const giphinateHandler = require('./lib/handlers/giphinate')
const deleteCachedGiphyHandler = require('./lib/handlers/deleteCachedGiphy')

const app = express()
const port = process.env.PORT || 8000

const setupExpress = () => {
  app
  .use(bodyParser.json())

  /**
    TODO: Add logging by decorating handlers, example logger decorator:
    const decorator = (handler) => (req, res) => {
      // log whatever you want from req object
      // ...
      // call handler and return its result
      return handler(req, res)
    }
  */
  .get('/:queryText', giphinateHandler)
  .delete('/:queryText', deleteCachedGiphyHandler)

  .listen(port, function () {
    logger.info(`Listening on port ${port}`)
  })
}

module.exports = setupExpress
