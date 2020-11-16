const Sequelize = require('sequelize')

const Blog = require('./Blog')
const Follow = require('./Follow')
const User = require('./User')

const config = require('../config')

var models = null

function initializeModels() {
    var sequelize = new Sequelize(config.DATABASE_STRING)

    var modelsList = []
    models = {
        syncAll: () => {
            // This block of code does some async juggling to
            // first drop all tables in reverse order, then
            // create tables in forward order.

            var dropIdx = modelsList.length - 1
            var dropNext = (callback) => {
                var curr = dropIdx
                dropIdx--

                modelsList[curr].drop().then(() => {
                    if (curr == 0) {
                        callback()
                    } else {
                        dropNext(callback)
                    }
                })
            }

            var syncIdx = 0
            var syncNext = (callback) => {
                var curr = syncIdx
                syncIdx++

                modelsList[curr].sync().then(() => {
                    if (curr == modelsList.length - 1) {
                        callback()
                    } else {
                        syncNext(callback)
                    }
                })
            }

            dropNext(() => {
                syncNext(() => {})
            })
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
