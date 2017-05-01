class GiphyCannotBeCreatedError extends Error {
  constructor (e, ...args) {
    super(...args)
    this.error = e
  }
}

module.exports = GiphyCannotBeCreatedError
