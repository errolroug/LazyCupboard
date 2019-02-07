module.exports = function(sequelize, DataTypes) {
  let RecipeIngredient = sequelize.define("RecipeIngredient", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 300]
      }
    }
  });

  RecipeIngredient.associate = function(models) {
    // an ingredient belongs to a user
    RecipeIngredient.belongsTo(models.Recipe, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return RecipeIngredient;
};
