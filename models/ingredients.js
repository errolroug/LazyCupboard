module.exports = function(sequelize, DataTypes) {
  let Ingredients = sequelize.define("Ingredients", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 }
    },
    measurementId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });
  return Ingredients;
};
