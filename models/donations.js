module.exports = function(sequelize, DataTypes) {
    var Donations = sequelize.define("Donations", {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Donations.associate = function(models) {
        Donations.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
    };

    return Donations;
}; 