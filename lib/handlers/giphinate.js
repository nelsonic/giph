'use strict'

const giphyRepository = require('../giphyRepository')
const giphyService = require('../giphyService')

/**
 * @params req.params.queryText {String} Text to query giphy for
 */
module.exports = function (req, res) {
  const STATUS_CODE_NOT_FOUND = 404
  const queryText = req.params.queryText;

  return giphyRepository
    .findByQueryText(queryText)
    .then((url) => res.send({ url }))
    .catch(() => {
      giphyService
        .getUrlByQueryText(queryText)
        .then((url) => {
          res.send({ url })
          giphyRepository.create(queryText, url)
        })
        .catch(() => {
          res.status(STATUS_CODE_NOT_FOUND)
          res.send({ status: STATUS_CODE_NOT_FOUND, message: 'Could not find a giphy for given query' })
        })
    })
}
