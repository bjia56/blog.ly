const Sequelize = require('sequelize')

function constructModel(sequelize, models) {
    var Follow = sequelize.define(
        'follow',
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
        },
        { freezeTableName: true, timestamps: false }
    )

    return Follow
}

module.exports = constructModel
