const express = require('express')
const router = express.Router()
const { getTraderAccounts } = require('./accountService')


router.get('/all', async (req, res) => {
    try {
        const accounts = await getTraderAccounts(req.session.passport.user)
        res.status(201).json(accounts)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get providers')
    }
})


router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router