const giphyRepository = require('../giphyRepository')
const giphyService = require('../giphyService')
const restGiphyService = require('../giphyService/gotRESTGiphyService')
const sequelizeGiphyRepository = require('../giphyRepository/sequelizeGiphyRepository.js')

describe('Prime SQL Cache with Entry for Given Query Text', () => {

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

  it('inserts a giphy record', (done) => {
    const queryText = 'mario'
    const giphyUrl = 'https://giphy.com/gifs/thread-edition-hyper-YTtqB2j5EN7IA'
    restGiphyService.getUrlByQueryText(queryText)
      .then((giphy) => {
        console.log('L12', giphy);
        expect(giphy.query).to.equal(queryText)
        expect(giphy.url).to.equal(giphyUrl)
      })
      .then(() => {
        sequelizeGiphyRepository.findByQueryText(queryText)
        .then((giphy) => {
          console.log('L19', giphy);
          expect(giphy.query).to.equal(queryText)
          expect(giphy.url).to.equal(giphyUrl)
        })
      })
      .then(() => done())
      .catch((e) => {
        console.log(e)
        done(e)
      })
  })
});
// restGiphyService.getUrlByQueryText
