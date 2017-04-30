'use strict'

// eslint-disable-next-line no-unused-vars
const schemas = require('../schemas')()

/**
 * @params req.params.queryText {String} Text to query giphy for
 */
module.exports = function (req, res) {
    // call to the giphy API using the `req.params.queryText` string

    // return the the gif URL, cache it for the next time the same query is used
  return Promise.resolve({})
}
