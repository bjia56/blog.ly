// initial cursor implementation. subject to change
class Cursor {
    constructor(offset) {
        this.offset = offset
    }

    static deserialize(cursor) {
        return JSON.parse(cursor)
    }

    serialize() {
        return JSON.stringify(this)
    }
}

module.exports = Cursor
