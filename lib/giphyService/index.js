/**
  @interface GiphyService
*/
module.exports = {
  /**
    @param {String} queryText
    @returns {Promise.<String, UrlNotFoundError|ServiceError>}
  */
  getUrlByQueryText: (queryText) => { throw new Error('Implement this function') }
}
