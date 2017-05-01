const logger = require('menna')

class GiphyRepositoryLogDecorator {
  constructor (giphyRepository) {
    this.giphyRepository = giphyRepository
  }

  /**
    @param {String} query
    @param {String} url
    @returns {Promise.<null, GiphyAlreadyExistsError|GiphyCannotBeCreatedError>}
  */
  create (query, url) {
    return this.giphyRepository.create(query, url)
      .catch((e) => {
        logger.error(e)
      })
  }

  /**
    @param {String} query
    @returns {Promise.<Object, GiphyNotFoundError>}
  */
  findByQueryText (query) {
    return this.giphyRepository.findByQueryText(query)
  }

  /**
    @param {String} query
    @returns {Promise.<null, GiphyNotFoundError>}
  */
  delete (query) {
    return this.giphyRepository.delete(query)
      .catch((e) => {
        logger.error(e)

        throw e
      })
  }
}

module.exports = GiphyRepositoryLogDecorator
