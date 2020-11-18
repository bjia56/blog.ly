const Sequelize = require('sequelize')

function constructModel(sequelize, models) {
    var Blog = sequelize.define(
        'blog',
        {
            uuid: {
                type: Sequelize.INTEGER,
                field: 'uuid',
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING,
                field: 'title',
                allowNull: false,
            },
            author: {
                type: Sequelize.INTEGER,
                field: 'author',
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
            content: {
                type: Sequelize.TEXT,
                field: 'content',
            },
        },
        { freezeTableName: true, updatedAt: 'updated', createdAt: 'created' }
    )

    return Blog
}

module.exports = constructModel
