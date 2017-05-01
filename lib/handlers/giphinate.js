'use strict'

const giphyRepository = require('../giphyRepository')
const giphyService = require('../giphyService')
const UrlNotFoundError = require('../giphyService/UrlNotFoundError')
const InternalServiceError = require('../giphyService/InternalServiceError')

const NOT_FOUND = 404
const INTERNAL_SERVER_ERROR = 500

const NOT_FOUND_MESSAGE = 'Could not find a giphy for given query'
const INTERNAL_ERROR_MESSAGE = 'Problem with external giphy service'

/**
 * @params req.params.queryText {String} Text to query giphy for
 */
const giphinateHandler = (req, res) => {
  const queryText = req.params.queryText;
  const respondWithGiphyUrl = (giphyUrl) => res.send({ url: giphyUrl })
  const respondWithError = (status, message) => {
    res.status(status)
    res.send({ status, message })
  }

  return giphyRepository.findByQueryText(queryText)
    .then((giphy) => respondWithGiphyUrl(giphy.url))
    .catch(() => {
      giphyService.getUrlByQueryText(queryText)
        .then((giphyUrl) => {
          respondWithGiphyUrl(giphyUrl)
          giphyRepository.create(queryText, giphyUrl)
        })
        .catch((e) => {
          if (e instanceof UrlNotFoundError) {
            respondWithError(NOT_FOUND, NOT_FOUND_MESSAGE)
          } else {
            respondWithError(INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MESSAGE)
          }
        })
    })
}

module.exports = giphinateHandler
