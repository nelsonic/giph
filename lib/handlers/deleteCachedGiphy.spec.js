const giphyRepository = require('../giphyRepository')
const deleteCachedGiphy = require('./deleteCachedGiphy')
const GiphyDeletionFailedError = require('../giphyRepository/GiphyDeletionFailedError')
const GiphyNotFoundError = require('../giphyRepository/GiphyNotFoundError')

describe('deleteCachedGiphy handler', () => {
  const dummyReq = { params: { queryText: 'q' } }
  const dummyRes = { send: () => {}, status: () => {} }
  let giphyRepositoryStub

  beforeEach(() => {
    giphyRepositoryStub = {
      delete: sinon.stub(giphyRepository, 'delete'),
    }
  })

  afterEach(() => {
    giphyRepositoryStub.delete.restore()
  })

  it('calls giphy repository to delete a giphy from cache db', () => {
    const expectedQueryText = 'query-text'
    const req = { params: { queryText: expectedQueryText } }
    giphyRepositoryStub.delete.returns(Promise.resolve(null))

    deleteCachedGiphy(req, dummyRes)

    expect(giphyRepositoryStub.delete).to.have.been.calledWith(expectedQueryText)
  })

  it('responds with No Content (204) status when giphy has been deleted successfully from cache', (done) => {
    const expectedStatus = 204

    const responseStub = { send: sinon.stub(), status: sinon.stub() }
    giphyRepositoryStub.delete.returns(Promise.resolve(null))

    deleteCachedGiphy(dummyReq, responseStub)
      .then(() => {
        expect(responseStub.status).to.have.been.calledWith(expectedStatus)
        expect(responseStub.send).to.have.been.called
      })
      .then(() => done())
      .catch(done)
  })

  it('responds with Not Found Error (404) status when giphy does not exist in cache', (done) => {
    const expectedStatusCode = 404
    const expectedResponse = { status: expectedStatusCode }

    const responseStub = { send: sinon.stub(), status: sinon.stub() }
    giphyRepositoryStub.delete.returns(Promise.reject(new GiphyNotFoundError))

    deleteCachedGiphy(dummyReq, responseStub)
      .then(() => {
        expect(responseStub.status).to.have.been.calledWith(expectedStatusCode)
        expect(responseStub.send).to.have.been.called
      })
      .then(() => done())
      .catch(done)
  })

  it('responds with Internal Server Error (500) status when giphy could not be deleted', (done) => {
    const expectedStatusCode = 500
    const expectedResponse = { status: expectedStatusCode }

    const responseStub = { send: sinon.stub(), status: sinon.stub() }
    giphyRepositoryStub.delete.returns(Promise.reject(new GiphyDeletionFailedError))

    deleteCachedGiphy(dummyReq, responseStub)
      .then(() => {
        expect(responseStub.status).to.have.been.calledWith(expectedStatusCode)
        expect(responseStub.send).to.have.been.called
      })
      .then(() => done())
      .catch(done)
  })
})
