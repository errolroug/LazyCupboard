module.exports = function(sequelize, DataTypes) {
  let Ingredients = sequelize.define("Ingredients", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    // quantity: {
    //   type: DataTypes.FLOAT,
    //   allowNull: false,
    //   defaultValue: 1,
    //   validate: { min: 0 }
    // },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    protein: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    fat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    carbs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    checked: {
      type: DataTypes.STRING,
      defaultValue: ""
    }
  });

  Ingredients.associate = function(models) {
    // an ingredient belongs to a user
    Ingredients.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Ingredients;
};
