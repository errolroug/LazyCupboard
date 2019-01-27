module.exports = function(sequelize, DataTypes) {
    var Measurements = sequelize.define("Measurements", {
      measurementType: DataTypes.STRING
    });
    return Measurements;
  };
  