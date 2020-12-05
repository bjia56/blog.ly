const Sequelize = require('sequelize')

function constructModel(sequelize, models) {
    var User = sequelize.define(
        'user',
        {
            uuid: {
                type: Sequelize.INTEGER,
                field: 'uuid',
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING,
                field: 'email',
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING,
                field: 'name',
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                field: 'description',
            },
            notificationPreference: {
                type: Sequelize.STRING,
                field: 'notificationPreference',
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                field: 'phone',
            },
        },
        { freezeTableName: true, timestamps: false }
    )

    return User
}

module.exports = constructModel
