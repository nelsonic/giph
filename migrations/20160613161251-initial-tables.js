const up = (queryInterface, DataTypes) =>
  queryInterface.createTable('giphys', {
    giphId: {
      field: 'giphy_id',
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    query: {
      type: DataTypes.TEXT,
      unique: true,
    },
    url: {
      type: DataTypes.TEXT,
    },
  })

const down = queryInterface => queryInterface.dropTable('giphys')

module.exports = {
  up,
  down,
}
