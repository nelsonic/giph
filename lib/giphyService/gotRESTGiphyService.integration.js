const gotRESTGiphyService = require('./gotRESTGiphyService')
const config = require('./gotRESTConfig')

describe('gotRESTGiphyService integration', () => {
  const port = 7000
  let serverResponse;

  before((done) => {
    config.searchUrl = `http://localhost:${port}`

    const express = require('express')
    const bodyParser = require('body-parser')
    const app = express()

    app
      .use(bodyParser.json())
      .get('/', (req, res) => res.send(serverResponse))
      .listen(port, () => done())
  })

  describe('::getUrlByQueryText', () => {
    it('resolves with url when server response is valid', (done) => {
      const expectedUrl = '/'
      serverResponse = { data: [{ url: expectedUrl }] }

      gotRESTGiphyService.getUrlByQueryText('q')
        .then((actualUrl) => expect(actualUrl).to.equal(expectedUrl))
        .then(() => done())
        .catch(done)
    })
  })
})
