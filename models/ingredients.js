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
      allowNull: true,
      defaultValue: 1,
      validate: { min: 0 }
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    fat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    carbs: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Ingredients.associate = function(models) {
    // an ingredient belongs to a measurement if applicable, otherwise quantity = # of that ingredient
    Ingredients.belongsTo(models.Measurements, {
      foreignKey: {
        allowNull: true
      }
    });
  };

  return Ingredients;
};
