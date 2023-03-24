const express = require('express')
const router = express.Router()
const { getTraderAccounts, getTraderBalances } = require('./accountService')


router.get('/banks', async (req, res) => {
    try {
        const accounts = await getTraderAccounts(req.session.passport.user)
        res.status(201).json(accounts)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get providers')
    }
})

router.get('/platform-balances', async ( req, res) => {
    try {
        const balances = await getTraderBalances(req.session.passport.user)
        res.status(201).json(balances)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get providers')
    }    
})


router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router