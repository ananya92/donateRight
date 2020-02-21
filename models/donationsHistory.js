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
    });

    DonationHistory.associate = function(models) {
        DonationHistory.belongsTo(models.Donations, {
          foreignKey: {
            allowNull: false
          }
        });
    };

    return DonationHistory;
};