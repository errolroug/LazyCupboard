const bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    email: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    password: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        len: [7, 255]
      }
    }
  });

  User.associate = function(models) {
    //associating Measurements with Ingredients
    User.hasMany(models.Ingredients, {});
  };

  User.prototype.getPassword = function() {
    return this.password;
  };
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
