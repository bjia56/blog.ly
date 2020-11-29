const path = require('path')

const config = {
    ROOT_DIR: __dirname,
    URL_PORT: 3000,
    URL_PATH: 'http://localhost',
    BASE_VERSION: 'v2',
    CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
    PROJECT_DIR: __dirname,
    OAUTH20_CLIENT_ID: process.env.OAUTH20_CLIENT_ID,
    OAUTH20_CLIENT_SECRET: process.env.OAUTH20_CLIENT_SECRET,
    EXPRESS_SESSION_KEY: process.env.EXPRESS_SESSION_KEY,
}
config.OPENAPI_YAML = path.join(config.ROOT_DIR, 'api', 'openapi.yaml')
config.FULL_PATH = `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`
config.FILE_UPLOAD_PATH = path.join(config.PROJECT_DIR, 'uploaded_files')
config.DATABASE_STRING = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

module.exports = config
