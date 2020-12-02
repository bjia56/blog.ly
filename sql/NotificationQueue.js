const Sequelize = require('sequelize')

function constructModel(sequelize, models) {
    var NotificationQueue = sequelize.define(
        'notificationQueue',
        {
            id: {
                type: Sequelize.INTEGER,
                field: 'id',
                primaryKey: true,
                autoIncrement: true,
            },
            follower: {
                type: Sequelize.INTEGER,
                field: 'follower',
                allowNull: false,
                references: {
                    model: models.User,
                    key: 'uuid',
                },
            },
            followee: {
                type: Sequelize.INTEGER,
                field: 'followee',
                allowNull: false,
                references: {
                    model: models.User,
                    key: 'uuid',
                },
            },
            created: {
                type: Sequelize.DATE,
                field: 'created',
                allowNull: false,
            },
            updated: {
                type: Sequelize.DATE,
                field: 'updated',
                allowNull: false,
            },
        },
        { freezeTableName: true, updatedAt: 'updated', createdAt: 'created' }
    )

    return NotificationQueue
}

module.exports = constructModel
