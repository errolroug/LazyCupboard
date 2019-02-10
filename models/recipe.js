module.exports = function(sequelize, DataTypes) {
  let Recipe = sequelize.define("Recipe", {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 300]
      }
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 400]
      }
    }
  });

  Recipe.associate = function(models) {
    // an ingredient belongs to a user
    Recipe.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  Recipe.associate = function(models) {
    //associating Measurements with Ingredients
    Recipe.hasMany(models.RecipeIngredient, {});
  };

  return Recipe;
};
