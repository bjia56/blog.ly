const db = require('../../../sql')

// entries must be a list of objects constructed from
// the database models via Model.build(...)
async function populateDatabase(entries) {
    await db.syncAll()
    for (var i = 0; i < entries.length; i++) {
        await entries[i].save()
    }
}

module.exports = {
    populateDatabase: populateDatabase,
}
