/**
  @interface GiphyService
*/
module.exports = {
  /**
    @param {String} queryText
    @returns {Promise.<String, UrlNotFoundError>}
  */
  getUrlByQueryText: (queryText) => throw new Error('Implement this function')
}
