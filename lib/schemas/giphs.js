module.exports = function (sequelize, DataTypes) {
  let Giphys = sequelize.define('Giphys', {
    giphyId: {
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
  }, {
    tableName: 'giphys',
    timestamps: true,
  })
  return Giphys
}
