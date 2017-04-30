/**
  @interface GiphyRepository
*/
module.exports = {
  /**
    @param {String} queryText
    @param {String} url
    @returns {Promise.<null, GiphyAlreadyExistsError|GiphyCannotBeCreatedError>}
  */
  create: (queryText, url) => throw new Error('Implement this function')

  /**
    @param {String} queryText
    @returns {Promise.<null, GiphyNotFoundError>}
  */
  delete: (queryText) => throw new Error('Implement this function')

  /**
    @param {GiphySpec} GiphySpec
    @returns {Promise.<String, GiphyNotFoundError>}
  */
  query: (giphySpec) => throw new Error('Implement this function')
}
