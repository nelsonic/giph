/**
  @interface GiphyRepository

  @param {String} queryText
  @param {String} url
  @returns {Promise.<null, GiphyAlreadyExistsError|GiphyCannotBeCreatedError>}
  create: (queryText, url) => { ... },

  @param {String} queryText
  @returns {Promise.<Object, GiphyNotFoundError>}
  findByQueryText: (queryText) => { ... }

  @param {String} queryText
  @returns {Promise.<null, GiphyNotFoundError>}
  delete: (queryText) => { ... },
}

/**
  Interface implementation
*/
const giphyRepository = {}
const sequelizeGiphyRepository = require('./sequelizeGiphyRepository')

giphyRepository.create = sequelizeGiphyRepository.create
giphyRepository.findByQueryText = sequelizeGiphyRepository.findByQueryText
giphyRepository.delete = sequelizeGiphyRepository.delete

const GiphyRepositoryLogDecorator = require('./GiphyRepositoryLogDecorator')

module.exports = new GiphyRepositoryLogDecorator(giphyRepository)
