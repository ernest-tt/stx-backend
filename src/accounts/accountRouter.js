const express = require('express')
const router = express.Router()
const { getTraderAccounts, getTraderBalances, addBankAccount } = require('./accountService')
const {getTrader} = require('../trader/traderService')


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

router.post('/add', async (req, res) => {
    try {
        const trader = await getTrader(req.session.passport.user)
        req.body.traderId = trader.trader_id
        const balances = await addBankAccount(req.body)
        res.status(201).json("success")
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get providers')
    }   
})


router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router