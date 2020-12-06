const twilioUtil = require('../util/twilio')

module.exports = async () => twilioUtil.setAPIEnabled(false)
