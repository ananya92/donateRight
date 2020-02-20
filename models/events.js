module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("Events", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Events.associate = function(models) {
        Events.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
    };

    return Events;
}; 