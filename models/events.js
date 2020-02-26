module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("Events", {
        description: {
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
        },
        charityKey: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });

    Events.associate = function(models) {
        Events.belongsTo(models.Charity, {
          foreignKey: {
            allowNull: false
          },
          onDelete: "cascade"
        });
    };

    return Events;
}; 