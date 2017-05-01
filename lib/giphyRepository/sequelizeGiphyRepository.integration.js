const sequelizeGiphyRepository = require('./sequelizeGiphyRepository')
const GiphyNotFoundError = require('./GiphyNotFoundError')

describe('Sequelize Giphy Repository integration', () => {
  let sequelize

  before((done) => {
    sequelize = require('../schemas')()
    sequelize.Giphys.sync()
      .then(() => done())
      .catch(done)
  })

  beforeEach((done) => {
    sequelize.Giphys.truncate()
      .then(() => done())
      .catch(done)
  })

  describe('::create', () => {
    it('inserts a giphy record', (done) => {
      const queryText = 'test query'
      const giphyUrl = 'http://giphy/1'

      sequelizeGiphyRepository.create(queryText, giphyUrl)
        .then(() => sequelize.Giphys.find({ where: { query: queryText } }))
        .then((giphy) => {
          expect(giphy.query).to.equal(queryText)
          expect(giphy.url).to.equal(giphyUrl)
        })
        .then(() => done())
        .catch((e) => done(e))
    })
  })

  describe('::findByQueryText', () => {
    it('finds a giphy when record with given query exists', (done) => {
      const expectedGiphy = { query: 'test-q', url: '/' }

      sequelize.Giphys.create(expectedGiphy)
        .then(() => sequelizeGiphyRepository.findByQueryText(expectedGiphy.query))
        .then((actualGiphy) => expect(actualGiphy).to.deep.equal(expectedGiphy))
        .then(() => done())
        .catch(done)
    })

    it('rejects with GiphyNotFoundError when record with given query does not exist', (done) => {
      sequelizeGiphyRepository.findByQueryText('q')
        .then(() => { throw new Error('Promise expected to be rejected') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyNotFoundError))
        .then(() => done())
        .catch(done)
    })
  })

  describe('::delete', (done) => {
    it('rejects with GiphyNotFoundError when record with given query does not exist', (done) => {
      sequelizeGiphyRepository.delete('q')
        .then(() => { throw new Error('Promise expected to be rejected') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyNotFoundError))
        .then(() => done())
        .catch(done)
    })

    it('deletes a giphy when record with given query exists', (done) => {
      const giphy = { query: 'test-q', url: '/' }

      sequelize.Giphys.create(giphy)
        .then(() => sequelizeGiphyRepository.delete(giphy.query))
        .then((actual) => expect(actual).to.be.null)
        .then(() => done())
        .catch(done)
    })
  })
})
