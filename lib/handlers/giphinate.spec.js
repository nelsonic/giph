const giphyRepository = require('../giphyRepository')
const giphyService = require('../giphyService')
const giphinate = require('./giphinate')
const UrlNotFoundError = require('../giphyService/UrlNotFoundError')
const InternalServiceError = require('../giphyService/InternalServiceError')

describe('giphinate handler', () => {
  const dummyReq = { params: { queryText: 'q' } }
  const dummyRes = { send: () => {} }
  const postpone = () => {}
  let giphyRepositoryStub
  let getUrlByQueryTextStub

  beforeEach(() => {
    giphyRepositoryStub = {
      create: sinon.stub(giphyRepository, 'create'),
      findByQueryText: sinon.stub(giphyRepository, 'findByQueryText')
    }
    getUrlByQueryTextStub = sinon.stub(giphyService, 'getUrlByQueryText')
  })

  afterEach(() => {
    giphyRepositoryStub.create.restore()
    giphyRepositoryStub.findByQueryText.restore()
    getUrlByQueryTextStub.restore()
  })

  it('calls giphy repository to find by query text with queryText request parameter', () => {
    const expectedQueryText = 'query-text'
    const req = { params: { queryText: expectedQueryText } }
    giphyRepositoryStub.findByQueryText.returns(Promise.resolve({ url: '/' }))

    giphinate(req, dummyRes)

    expect(giphyRepositoryStub.findByQueryText).to.have.been.calledWith(expectedQueryText)
  })

  it('responds successfully with url when giphy repository url search has succeeded', (done) => {
    const foundUrl = '/t/e/s/t'
    const expectedResponse = { url: foundUrl }

    const responseStub = { send: sinon.stub() }
    giphyRepositoryStub.findByQueryText.returns(Promise.resolve({ url: foundUrl }))

    giphinate(dummyReq, responseStub)
      .then(() => expect(responseStub.send).to.have.been.calledWith(expectedResponse))
      .then(() => done())
      .catch(done)
  })

  describe('when giphy repository search fails', () => {
    beforeEach(() => {
      giphyRepositoryStub.findByQueryText.returns(Promise.reject('Error'))
    })

    it('calls giphy service with queryText parameter', (done) => {
      const expectedQueryText = 'query-text'
      const req = { params: { queryText: expectedQueryText } }

      getUrlByQueryTextStub.returns(Promise.resolve())

      giphinate(req, dummyRes)
        .then(() => expect(getUrlByQueryTextStub).to.have.been.calledWith(expectedQueryText))
        .then(() => done())
        .catch(done)
    })

    it('responds successfully with url when giphy service search has succeeded', (done) => {
      const foundUrl = '/t2/e2/s2/t2'
      const expectedResponse = { url: foundUrl }

      const responseStub = { send: sinon.stub() }
      getUrlByQueryTextStub.returns(Promise.resolve(foundUrl))

      giphinate(dummyReq, responseStub)
        .then(() => expect(responseStub.send).to.have.been.calledWith(expectedResponse))
        .then(() => done())
        .catch(done)
    })

    it('responds with not found error and 404 status code when giphy service has not found giphy url', (done) => {
      const expectedStatusCode = 404
      const expectedResponse = { status: expectedStatusCode, message: 'Could not find a giphy for given query' }

      const responseStub = { send: sinon.stub(), status: sinon.stub() }
      getUrlByQueryTextStub.returns(Promise.reject(new UrlNotFoundError))

      giphinate(dummyReq, responseStub)
        .then(() => postpone)
        .then(() => {
          expect(responseStub.status).to.have.been.calledWith(expectedStatusCode)
          expect(responseStub.send).to.have.been.calledWith(expectedResponse)
        })
        .then(() => done())
        .catch(done)
    })

    it('responds with internal server error and 500 status code when giphy service search has failed', (done) => {
      const expectedStatusCode = 500
      const expectedResponse = { status: expectedStatusCode, message: 'Problem with external giphy service' }

      const responseStub = { send: sinon.stub(), status: sinon.stub() }
      getUrlByQueryTextStub.returns(Promise.reject(new InternalServiceError))

      giphinate(dummyReq, responseStub)
        .then(() => postpone)
        .then(() => {
          expect(responseStub.status).to.have.been.calledWith(expectedStatusCode)
          expect(responseStub.send).to.have.been.called
        })
        .then(() => done())
        .catch(done)
    })

    it('adds giphy url to the giphy repository when giphy service search has succeeded', (done) => {
      const expectedQueryText = 'query-text'
      const expectedGiphyUrl = '/t3/e3/s3/t3'
      const req = { params: { queryText: expectedQueryText } }

      getUrlByQueryTextStub.returns(Promise.resolve(expectedGiphyUrl))

      giphinate(req, dummyRes)
        .then(() => expect(giphyRepositoryStub.create).to.have.been.calledWith(expectedQueryText, expectedGiphyUrl))
        .then(() => done())
        .catch(done)
    })
  })
})
