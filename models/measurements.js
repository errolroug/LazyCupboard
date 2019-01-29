module.exports = function(sequelize, DataTypes) {
    var Measurements = sequelize.define("Measurements", {
      measurementType: DataTypes.STRING
    });

    Measurements.associate = function(models) {
        //associating Measurements with Ingredients
        Measurements.hasMany(models.Ingredients, {

        });
    };

    return Measurements;
  };
  