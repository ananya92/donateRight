module.exports = function(sequelize, DataTypes) {
    var Donations = sequelize.define("Donations", {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lat: {
            type: DataTypes.DECIMAL(9,6),
            allowNull: false
        },
        lng: {
            type: DataTypes.DECIMAL(9,6),
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