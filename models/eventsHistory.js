module.exports = function(sequelize, DataTypes) {
    var EventHistory = sequelize.define("EventHistory", {
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        charityKey: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    EventHistory.associate = function(models) {
        EventHistory.belongsTo(models.Charity, {
          foreignKey: {
            allowNull: false
          },
          onDelete: "cascade"
        });
    };

    return EventHistory;
}; 