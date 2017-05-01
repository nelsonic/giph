const schema = require('../schemas')()
const Sequelize = require('sequelize')
const sequelizeGiphyRepository = require('./sequelizeGiphyRepository')
const GiphyAlreadyExistsError = require('./GiphyAlreadyExistsError')
const GiphyCannotBeCreatedError = require('./GiphyCannotBeCreatedError')

describe('sequelizeGiphyRepository', () => {
  const queryText = 'test-query'
  const giphyUrl = 'test-url'
  let giphyStub

  beforeEach(() => {
    giphyStub = { create: sinon.stub(schema.Giphys, 'create') }
  })

  afterEach(() => {
    giphyStub.create.restore()
  })

  describe('::create', () => {
    it('creates a new Giphy', () => {
      const expectedGiphyEntity = { query: queryText, url: giphyUrl }
      giphyStub.create.returns(Promise.resolve())

      sequelizeGiphyRepository.create(queryText, giphyUrl)

      expect(giphyStub.create).to.have.been.calledWith(expectedGiphyEntity)
    })

    it('returns a Promise', () => {
      giphyStub.create.returns(Promise.resolve())

      const actual = sequelizeGiphyRepository.create('q', '/')

      expect(actual).to.be.a('Promise')
    })

    it('resolves a Promise with no value when Giphy has been created successfully', (done) => {
      giphyStub.create.returns(Promise.resolve('success'))

      sequelizeGiphyRepository.create(queryText, giphyUrl)
        .then((actual) => expect(actual).to.be.null)
        .then(() => done())
        .catch(done)
    })

    it('rejects a Promise with GiphyAlreadyExistsError when Giphy creation has failed with UniqueConstraintError', (done) => {
      giphyStub.create.returns(Promise.reject(new Sequelize.UniqueConstraintError))

      sequelizeGiphyRepository.create(queryText, giphyUrl)
        .then(() => done(new Error('Expected promise to be rejected with GiphyAlreadyExistsError')))
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyAlreadyExistsError))
        .then(() => done())
        .catch(done)
    })

    it('rejects a Promise with GiphyCannotBeCreatedError when Giphy creation has failed with unrecognized error', (done) => {
      giphyStub.create.returns(Promise.reject(new Error))

      sequelizeGiphyRepository.create(queryText, giphyUrl)
        .then(() => done(new Error('Expected promise to be rejected with GiphyCannotBeCreatedError')))
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyCannotBeCreatedError))
        .then(() => done())
        .catch(done)
    })
  })
})
