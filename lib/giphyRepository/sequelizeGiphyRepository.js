const SequelizeGiphyRepository = require('./index')
const schemas = require('../schemas')()
const Sequelize = require('sequelize')
const GiphyAlreadyExistsError = require('./GiphyAlreadyExistsError')
const GiphyCannotBeCreatedError = require('./GiphyCannotBeCreatedError')

/**
  @param {String} query
  @param {String} url
  @returns {Promise.<null, GiphyAlreadyExistsError|GiphyCannotBeCreatedError>}
*/
SequelizeGiphyRepository.create = (query, url) => {
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
  @param {String} queryText
  @returns {Promise.<null, GiphyNotFoundError>}
*/
SequelizeGiphyRepository.delete = (queryText) => {

}

/**
  @param {String} queryText
  @returns {Promise.<String, GiphyNotFoundError>}
*/
SequelizeGiphyRepository.findByQueryText = (queryText) => {

}

module.exports = SequelizeGiphyRepository
