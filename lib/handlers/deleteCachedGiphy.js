const giphyRepository = require('../giphyRepository')
const GiphyNotFoundError = require('../giphyRepository/GiphyNotFoundError')

const NO_CONTENT = 204
const NOT_FOUND = 404
const INTERNAL_SERVER_ERROR = 500

const deleteCachedGiphyHandler = (req, res) => {
  const queryText = req.params.queryText

  return giphyRepository.delete(queryText)
    .then(() => {
      res.status(NO_CONTENT)
      res.send()
    })
    .catch((e) => {
      if (e instanceof GiphyNotFoundError) {
        res.status(NOT_FOUND)
      } else {
        res.status(INTERNAL_SERVER_ERROR)
      }

      res.send()
    })
}

module.exports = deleteCachedGiphyHandler
