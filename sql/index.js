const Sequelize = require('sequelize')

const Blog = require('./Blog')
const Follow = require('./Follow')
const User = require('./User')

const config = require('../config')

var models = null

function initializeModels() {
    var sequelize = new Sequelize(config.DATABASE_STRING, {
        logging: false,
    })

    var modelsList = []
    models = {
        close: () => {
            sequelize.close()
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
}

function getModels() {
    if (models == null) {
        initializeModels()
    }

    return models
}

module.exports = getModels()
