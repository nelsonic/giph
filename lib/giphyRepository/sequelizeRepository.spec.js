const schema = require('../schemas')()
const Sequelize = require('sequelize')
const sequelizeGiphyRepository = require('./sequelizeGiphyRepository')
const GiphyAlreadyExistsError = require('./GiphyAlreadyExistsError')
const GiphyCannotBeCreatedError = require('./GiphyCannotBeCreatedError')
const GiphyNotFoundError = require('./GiphyNotFoundError')

describe('sequelizeGiphyRepository', () => {
  const queryText = 'test-query'
  const giphyUrl = 'test-url'
  let giphyStub

  beforeEach(() => {
    giphyStub = {
      create: sinon.stub(schema.Giphys, 'create'),
      find: sinon.stub(schema.Giphys, 'find'),
      destroy: sinon.stub(schema.Giphys, 'destroy')
    }
  })

  afterEach(() => {
    giphyStub.create.restore()
    giphyStub.find.restore()
    giphyStub.destroy.restore()
  })

  describe('::create', () => {
    it('creates a new giphy', () => {
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
        .then(() => { throw new Error('Expected promise to be rejected with GiphyCannotBeCreatedError') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyCannotBeCreatedError))
        .then(() => done())
        .catch(done)
    })
  })

  describe('::findByQueryText', () => {
    it('looks for giphy', () => {
      giphyStub.find.returns(Promise.resolve({ query: queryText, url: giphyUrl }))

      sequelizeGiphyRepository.findByQueryText(queryText)

      expect(giphyStub.find).to.have.been.calledWith({ where: { query: queryText } })
    })

    it('returns a Promise', () => {
      giphyStub.find.returns(Promise.resolve({ query: queryText, url: giphyUrl }))

      const actual = sequelizeGiphyRepository.findByQueryText('q')

      expect(actual).to.be.a('Promise')
    })

    it('resolves a Promise with giphy when it has been found', (done) => {
      const expectedGiphy = { query: queryText, url: giphyUrl }
      giphyStub.find.returns(Promise.resolve(expectedGiphy))

      sequelizeGiphyRepository.findByQueryText(queryText)
        .then((actualGiphy) => expect(actualGiphy).to.deep.equal(expectedGiphy))
        .then(() => done())
        .catch(done)
    })

    it('rejects a Promise with GiphyNotFoundError when giphy has not been found', (done) => {
      giphyStub.find.returns(Promise.resolve())

      sequelizeGiphyRepository.findByQueryText(queryText)
        .then(() => { throw new Error('Promise expected to be rejected with GiphyNotFoundError') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyNotFoundError))
        .then(() => done())
        .catch(done)
    })

    it('rejects a Promise with GiphyNotFoundError when find query has failed', (done) => {
      giphyStub.find.returns(Promise.reject())

      sequelizeGiphyRepository.findByQueryText(queryText)
        .then(() => { throw new Error('Promise expected to be rejected with GiphyNotFoundError') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyNotFoundError))
        .then(() => done())
        .catch(done)
    })
  })

  describe('::delete', () => {
    it('destroys a giphy', () => {
      giphyStub.destroy.returns(Promise.resolve(1))

      sequelizeGiphyRepository.delete(queryText)

      expect(giphyStub.destroy).to.have.been.calledWith({ where: { query: queryText } })
    })

    it('returns a Promise', () => {
      giphyStub.destroy.returns(Promise.resolve(1))

      const actual = sequelizeGiphyRepository.delete('q')

      expect(actual).to.be.a('Promise')
    })

    it('resolves a Promise with no value when deletion has been successfull', (done) => {
      giphyStub.destroy.returns(Promise.resolve('success'))

      sequelizeGiphyRepository.delete('q')
        .then((actual) => expect(actual).to.be.null)
        .then(() => done())
        .catch(done)
    })

    it('rejects a Promise with GiphyNotFoundError when no records has been deleted', (done) => {
      giphyStub.destroy.returns(Promise.resolve(0))

      sequelizeGiphyRepository.delete(queryText)
        .then(() => { throw new Error('Promise expected to be rejected with GiphyNotFoundError') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyNotFoundError))
        .then(() => done())
        .catch(done)
    })

    it('rejects a Promise with GiphyNotFoundError when deletion has failed', (done) => {
      giphyStub.destroy.returns(Promise.reject('error'))

      sequelizeGiphyRepository.delete(queryText)
        .then(() => { throw new Error('Promise expected to be rejected with GiphyNotFoundError') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(GiphyNotFoundError))
        .then(() => done())
        .catch(done)
    })
  })
})
