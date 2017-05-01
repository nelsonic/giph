const got = require('got')
const gotRESTGiphyService = require('./gotRESTGiphyService')
const config = require('./gotRESTConfig')
const UrlNotFoundError = require('./UrlNotFoundError')
const InternalServiceError = require('./InternalServiceError')

describe('gotRESTGiphyService', () => {
  let gotStub

  beforeEach(() => {
    gotStub = { get: sinon.stub(got, 'get') }
  })

  afterEach(() => {
    gotStub.get.restore()
  })

  describe('::getUrlByQueryText', () => {
    it('calls "got" get', () => {
      const queryText = 'test'
      const expectedUrl = `${config.searchUrl}?q=${queryText}&api_key=${config.apiKey}`
      gotStub.get.returns(Promise.resolve())

      gotRESTGiphyService.getUrlByQueryText(queryText).catch(() => {})

      expect(gotStub.get).to.have.been.calledWith(expectedUrl)
    })

    it('resolves with giphy url when service has returned results in correct format', (done) => {
      const expectedUrl = 'expected-url'
      const correctServiceResult = {
        body: {
          data: [{ url: expectedUrl }, { url: 'random' }]
        }
      }
      gotStub.get.returns(Promise.resolve(correctServiceResult))

      gotRESTGiphyService.getUrlByQueryText('test')
        .then((actualUrl) => expect(actualUrl).to.equal(expectedUrl))
        .then(() => done())
        .catch(done)
    })

    it('rejects with UrlNotFoundError when service has returned empty result', (done) => {
      gotStub.get.returns(Promise.resolve({
        body: { data: [] }
      }))

      gotRESTGiphyService.getUrlByQueryText('test')
        .then(() => { throw new Error('Promise expected to be rejected') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(UrlNotFoundError))
        .then(() => done())
        .catch(done)
    })

    it('rejects with InternalServiceError when service request failed', (done) => {
      gotStub.get.returns(Promise.reject({ statusCode: 500, response: {}}))

      gotRESTGiphyService.getUrlByQueryText('test')
        .then(() => { throw new Error('Promise expected to be rejected') })
        .catch((actualError) => expect(actualError).to.be.an.instanceof(InternalServiceError))
        .then(() => done())
        .catch(done)
    })
  })
})
