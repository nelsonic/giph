const sequelizeGiphyRepository = require('./sequelizeGiphyRepository')

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
})
