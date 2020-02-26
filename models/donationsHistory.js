module.exports = function(sequelize, DataTypes) {
    var DonationHistory = sequelize.define("DonationHistory", {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });

    DonationHistory.associate = function(models) {
        DonationHistory.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          },
          onDelete: "cascade"
        });
    };

    return DonationHistory;
};