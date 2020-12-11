// This is a workaround for mysql1
// See: https://github.com/sidorares/node-mysql2/issues/489
import iconv from 'iconv-lite'
import encodings from 'iconv-lite/encodings'
iconv.encodings = encodings

const db = require('../../sql')
const { Init: initElastic } = require('../../elastic')

// entries must be a list of objects constructed from
// the database models via Model.build(...)
async function populateDatabase(entries) {
    await initElastic()
    await db.syncAll()
    for (var i = 0; i < entries.length; i++) {
        await entries[i].save()
    }
}

module.exports = {
    populateDatabase: populateDatabase,
}
