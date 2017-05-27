const got = require('got')
const restGiphyService = require('./index')
const config = require('./gotRESTConfig')
const UrlNotFoundError = require('./UrlNotFoundError')
const InternalServiceError = require('./InternalServiceError')
const sequelizeGiphyRepository =
  require('../giphyRepository/sequelizeGiphyRepository')
const qs = require('qs');


const extractUrlFromResponse = (response) => {
  var run = false;
  try {
    var query = qs.parse(response.url.split('?')[1]).q;
    console.log('RESPONSE', query, response.url);
    if(run) {
      run = true;
      sequelizeGiphyRepository.create(query, response.body.data[0].url)
    }
    return response.body.data[0].url
  } catch (e) {
    throw new UrlNotFoundError(e)
  }
}

/**
  @param {String} queryText
  @returns {Promise.<String, UrlNotFoundError>}
*/
restGiphyService.getUrlByQueryText = (queryText) => {
  return got.get(
    `${config.searchUrl}?q=${queryText}&api_key=${config.apiKey}`,
    { json: true }
  )
    .then(extractUrlFromResponse)
    .catch((e) => {
      console.log(e);
      if (e instanceof UrlNotFoundError) {
        throw e
      }

      throw new InternalServiceError(e)
    })
}

module.exports = restGiphyService
