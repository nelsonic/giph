const fs = require('fs')
const path = require('path')
const log = require('menna')
const dbConfig = require('../../database.json').development
let db

module.exports = function (cfg) {
  if (db) return db

  dbConfig.logging = log.info
  const Sequelize = require('sequelize')
  const sequelize = new Sequelize('sqlite://database.sqlite')
  const _db = {}

  sequelize.authenticate().catch(function (error) {
    console.log(error)
  })

  // read models in the current folder and import schemas into sequelize
  fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
      var model = sequelize.import(path.join(__dirname, file))
      log.info('Loaded model:', model.name)
      _db[model.name] = model
    })

  Object.keys(_db).forEach(function (modelName) {
    if ('associate' in _db[modelName]) {
      _db[modelName].associate(_db)
    }
  })

  _db.sequelize = sequelize
  _db.Sequelize = Sequelize

  db = _db
  return _db
}
