module.exports = function(sequelize, DataTypes) {
    var EventHistory = sequelize.define("EventHistory", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    EventHistory.associate = function(models) {
        EventHistory.belongsTo(models.Events, {
          foreignKey: {
            allowNull: false
          }
        });
    };

    return EventHistory;
}; 