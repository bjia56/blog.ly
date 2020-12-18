const { Client } = require('@elastic/elasticsearch')
const config = require('./config')

const client = new Client({
    node: config.ELASTIC_API,
})

module.exports = {
    Client: client,

    Init: async () => {
        await client.indices.create({
            index: 'blogs',
            include_type_name: false,
            body: {
                mappings: {
                    properties: {
                        uuid: { type: 'integer' },
                        author: { type: 'integer' },
                        authorName: { type: 'keyword' },
                        title: { type: 'text', analyzer: 'my_analyzer' },
                        contents: { type: 'text', analyzer: 'my_analyzer' },
                    },
                },
                settings: {
                    analysis: {
                        analyzer: {
                            my_analyzer: {
                                tokenizer: 'standard',
                                char_filter: ['html_strip'],
                                filter: [
                                    'english_possessive_stemmer',
                                    'lowercase',
                                    'english_stop',
                                    'english_keywords',
                                    'english_stemmer',
                                ],
                            },
                        },
                    },
                },
            },
        })
    },

    TearDown: async () => {
        await client.indices.delete({ index: 'blogs' })
    },
}
