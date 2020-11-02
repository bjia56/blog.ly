const express = require('express')
const router = express.Router()

router.get('/test', (req, res) => {
    res.json({ result: 'successful' })
})

module.exports = router
