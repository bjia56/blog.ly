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
            username: {
                type: Sequelize.STRING,
                field: 'username',
                allowNull: false,
            },
            passwordHash: {
                type: Sequelize.STRING,
                field: 'passwordHash',
                allowNull: false,
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
        },
        { freezeTableName: true, timestamps: false }
    )

    return User
}

module.exports = constructModel
