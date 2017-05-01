'use strict'

const giphyRepository = require('../giphyRepository')
const giphyService = require('../giphyService')

const STATUS_CODE_NOT_FOUND = 404
const ERROR_MESSAGE_NOT_FOUND = 'Could not find a giphy for given query'

/**
 * @params req.params.queryText {String} Text to query giphy for
 */
const giphinateHandler = (req, res) => {
  const queryText = req.params.queryText;
  const respondWithGiphyUrl = (giphyUrl) => res.send({ url: giphyUrl })

  return giphyRepository.findByQueryText(queryText)
    .then((giphy) => respondWithGiphyUrl(giphy.url))
    .catch(() => {
      giphyService.getUrlByQueryText(queryText)
        .then((giphyUrl) => {
          respondWithGiphyUrl(giphyUrl)
          giphyRepository.create(queryText, giphyUrl)
        })
        .catch(() => {
          res.status(STATUS_CODE_NOT_FOUND)
          res.send({ status: STATUS_CODE_NOT_FOUND, message: ERROR_MESSAGE_NOT_FOUND })
        })
    })
}

module.exports = giphinateHandler
