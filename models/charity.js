var bcrypt = require("bcryptjs");

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
        charityKey: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Charity.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    Charity.addHook("beforeCreate", function(charity) {
        charity.password = bcrypt.hashSync(charity.password, bcrypt.genSaltSync(10), null);
    });
    
    return Charity;
};