var MarkdownIt = require('markdown-it')()

const Service = require('./Service')
const Database = require('../sql')
const { Client: ESClient } = require('../elastic')
const { sendNotifications } = require('../util/twilio')

const Blog = Database.Blog
const User = Database.User

function toUnixTime(datetime) {
    return Math.floor(datetime.getTime() / 1000)
}

function requireAuthenticated(loggedInUser) {
    if (loggedInUser == null || loggedInUser.uuid == null) {
        throw {
            message: 'Unauthorized',
            status: 401,
        }
    }
}

/**
 * Get a list of blogs
 *
 * author Integer Fetch blogs by author uuid. (optional)
 * cursor String Cursor token for paging the blogs returned. (optional)
 * limit Integer Maximum number of results to return in a page. (optional)
 * returns List
 * */
const apiBlogsGET = ({ author, cursor, limit }) =>
    new Promise(async (resolve, reject) => {
        try {
            var query = {
                limit: limit,
                order: [['updated', 'DESC']],
                where: {},
            }
            if (author != null) {
                query.where.author = author
            }
            var results = await Blog.findAll(query)

            resolve(
                Service.successResponse({
                    uuids: results.map((r) => r.uuid),
                })
            )
        } catch (e) {
            reject(Service.rejectResponse(e))
        }
    })

/**
 * Create a new blog
 * This can only be done by users who have logged in.
 *
 * returns Integer
 * */
const apiBlogsPOST = (_, loggedInUser) =>
    new Promise(async (resolve, reject) => {
        try {
            requireAuthenticated(loggedInUser)

            var blog = await Blog.create({
                author: loggedInUser.uuid,
                title: '',
            })

            resolve(
                Service.successResponse(
                    {
                        uuid: blog.uuid,
                    },
                    201
                )
            )
        } catch (e) {
            reject(Service.rejectResponse(e))
        }
    })

/**
 * Delete an existing blog
 * This can only be done by users who have logged in and on blogs that the user has authored.
 *
 * uuid Integer Blog uuid.
 * no response value expected for this operation
 * */
const apiBlogsUuidDELETE = ({ uuid }, loggedInUser) =>
    new Promise(async (resolve, reject) => {
        try {
            requireAuthenticated(loggedInUser)

            var blogs = await Blog.findAll({ where: { uuid: uuid } })
            if (blogs.length == 0) {
                throw {
                    message: 'Blog not found',
                    status: 404,
                }
            }

            var blog = blogs[0]
            if (blog.author !== loggedInUser.uuid) {
                throw {
                    message: 'Unauthorized',
                    status: 403,
                }
            }

            await blog.destroy()
            resolve(Service.successResponse())
        } catch (e) {
            reject(Service.rejectResponse(e))
        }
    })

/**
 * Get blog details
 *
 * uuid Integer Blog uuid.
 * returns Blog
 * */
const apiBlogsUuidGET = ({ uuid }) =>
    new Promise(async (resolve, reject) => {
        try {
            var blogs = await Blog.findAll({ where: { uuid: uuid } })
            if (blogs.length == 0) {
                throw {
                    message: 'Blog not found',
                    status: 404,
                }
            }
            var blog = blogs[0]

            var author = await User.findAll({
                where: { uuid: blog.author },
                limit: 1,
            })
            author = author[0]

            if (blog.content === null) {
                blog.content = ''
            }

            resolve(
                Service.successResponse({
                    uuid: blog.uuid,
                    title: blog.title,
                    contents: blog.content,
                    rendered: MarkdownIt.render(blog.content),
                    created: toUnixTime(blog.created),
                    updated: toUnixTime(blog.updated),
                    author: blog.author,
                    authorName: author.name,
                })
            )
        } catch (e) {
            reject(Service.rejectResponse(e))
        }
    })

/**
 * Update an existing blog
 * This can only be done by users who have logged in and on blogs that the user has authored.
 *
 * uuid Integer Blog uuid.
 * body New blog contents
 * no response value expected for this operation
 * */
const apiBlogsUuidPUT = ({ uuid, body }, loggedInUser) =>
    new Promise(async (resolve, reject) => {
        try {
            requireAuthenticated(loggedInUser)

            var blogs = await Blog.findAll({ where: { uuid: uuid } })
            if (blogs.length == 0) {
                throw {
                    message: 'Blog not found',
                    status: 404,
                }
            }

            var blog = blogs[0]
            if (blog.author !== loggedInUser.uuid) {
                throw {
                    message: 'Unauthorized',
                    status: 403,
                }
            }

            if (body.title != null) {
                blog.title = body.title
            }
            if (body.contents != null) {
                blog.content = body.contents
            }

            const author = await User.findAll({
                where: { uuid: blog.author },
                limit: 1,
            })
            console.log('Author Results:' + JSON.stringify(author))

            if (body.title != null && body.contents != null) {
                sendNotifications(author[0])
            }

            await blog.save()

            console.log('ES update', {
                uuid: blog.uuid,
                author: blog.author,
                authorName: author[0].name,
                title: blog.title,
                contents: blog.content,
            })

            await ESClient.update({
                index: 'blogs',
                id: blog.uuid,
                body: {
                    doc: {
                        uuid: blog.uuid,
                        author: blog.author,
                        authorName: author[0].name,
                        title: blog.title,
                        contents: blog.content,
                    },
                    doc_as_upsert: true,
                },
            })

            resolve(Service.successResponse())
        } catch (e) {
            console.log(e)
            reject(Service.rejectResponse(e))
        }
    })

module.exports = {
    apiBlogsGET,
    apiBlogsPOST,
    apiBlogsUuidDELETE,
    apiBlogsUuidGET,
    apiBlogsUuidPUT,
}
