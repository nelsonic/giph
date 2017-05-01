/**
  @interface GiphyService

  @param {String} queryText
  @returns {Promise.<String, UrlNotFoundError|ServiceError>}
  getUrlByQueryText: (queryText) => { ... }
*/

/**
  Interface implementation
*/
const giphyService = {}
const gotRESTGiphyService = require('./gotRESTGiphyService')

giphyService.getUrlByQueryText = gotRESTGiphyService.getUrlByQueryText

module.exports = giphyService
