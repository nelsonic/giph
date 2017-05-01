const schemas = require('../schemas')()
const Sequelize = require('sequelize')
const GiphyAlreadyExistsError = require('./GiphyAlreadyExistsError')
const GiphyCannotBeCreatedError = require('./GiphyCannotBeCreatedError')
const GiphyNotFoundError = require('./GiphyNotFoundError')
const GiphyDeletionFailedError = require('./GiphyDeletionFailedError')

const sequelizeGiphyRepository = {}

/**
  @param {String} query
  @param {String} url
  @returns {Promise.<null, GiphyAlreadyExistsError|GiphyCannotBeCreatedError>}
*/
sequelizeGiphyRepository.create = (query, url) => {
  return schemas.Giphys.create({ query, url })
    .then(() => null)
    .catch((e) => {
      if (e instanceof Sequelize.UniqueConstraintError) {
        throw new GiphyAlreadyExistsError()
      } else {
        throw new GiphyCannotBeCreatedError(e)
      }
    })
}

/**
  @param {String} query
  @returns {Promise.<Object, GiphyNotFoundError>}
*/
sequelizeGiphyRepository.findByQueryText = (query) => {
  return schemas.Giphys.find({ where: { query } })
    .then((giphy) => {
      if (giphy && giphy.query && giphy.url) {
        return {
          query: giphy.query,
          url: giphy.url,
        }
      }

      throw new GiphyNotFoundError()
    })
    .catch(() => { throw new GiphyNotFoundError() })
}

/**
  @param {String} query
  @returns {Promise.<null, GiphyNotFoundError>}
*/
sequelizeGiphyRepository.delete = (query) => {
  return schemas.Giphys.destroy({ where: { query } })
    .then((deleted) => {
      if (!deleted) {
        throw new GiphyNotFoundError()
      }
      return null
    })
    .catch((e) => {
      if (e instanceof GiphyNotFoundError) {
        throw e
      }

      throw new GiphyDeletionFailedError(e)
    })
}

module.exports = sequelizeGiphyRepository
