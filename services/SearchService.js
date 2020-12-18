/* eslint-disable no-unused-vars */
const Service = require('./Service')

const { Client } = require('../elastic')

/**
 * Search for blogs
 *
 * keyword String Keyword(s) to search for
 * cursor String Cursor token for paging the blogs returned. (optional)
 * limit Integer Maximum number of results to return in a page. (optional)
 * returns List
 * */
const apiSearchGET = ({ keyword, cursor, limit }) =>
    new Promise(async (resolve, reject) => {
        try {
            Client.search({
                index: 'blogs',
                body: {
                    query: {
                        bool: {
                            should: {
                                match_phrase: {
                                    title: keyword,
                                },
                            },
                            should: {
                                match_phrase: {
                                    contents: keyword,
                                },
                            },
                        },
                    },
                    highlight: {
                        fields: {
                            contents: {},
                        },
                        encoder: 'html',
                        pre_tags: ['<mark class="bg-warning">'],
                        post_tags: ['</mark>'],
                        number_of_fragments: 0,
                    },
                },
            }).then((resp) => {
                if (resp.body.hits) {
                    const ret = resp.body.hits.hits.map((hit) => {
                        return {
                            blog: hit._source.uuid,
                            title: hit._source.title,
                            contents: hit.highlight.contents[0],
                            author: hit._source.author,
                            authorName: hit._source.authorName,
                        }
                    })
                    resolve(Service.successResponse(ret))
                }
                resolve(Service.successResponse([]))
            })
        } catch (e) {
            console.log(e)
            reject(Service.rejectResponse(e))
        }
    })

module.exports = {
    apiSearchGET,
}
