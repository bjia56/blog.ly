const Sequelize = require('sequelize')

const Blog = require('./Blog')
const Follow = require('./Follow')
const User = require('./User')

const config = require('../config')

function initializeModels() {
    var sequelize = new Sequelize(config.DATABASE_STRING, {
        logging: false,
    })

    var modelsList = []
    var models = {
        close: async () => {
            await sequelize.close()
        },
        syncAll: async () => {
            for (var i = 1; i <= modelsList.length; i++) {
                await modelsList[modelsList.length - i].drop()
            }

            for (var i = 0; i < modelsList.length; i++) {
                await modelsList[i].sync()
            }
        },
    }

    modelsList = [
        (models.User = User(sequelize, models)),
        (models.Blog = Blog(sequelize, models)),
        (models.Follow = Follow(sequelize, models)),
    ]

    return models
}

module.exports = initializeModels()
