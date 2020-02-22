module.exports = function(sequelize, DataTypes) {
    var Charity = sequelize.define("Charity", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
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
    });
    
    return Charity;
};