const express = require('express')
const router = express.Router()
const { getTraderAccounts, getTraderBalances,
     addBankAccount, getAllBanks, checkTraderAccountDuplicate } = require('./accountService')
const {getTrader} = require('../trader/traderService')


router.get('/banks', async (req, res) => {
    try {
        const accounts = await getTraderAccounts(req.session.passport.user)
        res.status(200).json(accounts)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get providers')
    }
})

router.get('/all-banks', async (req, res) => {
    try {
        const accounts = await getAllBanks()
        res.status(200).json(accounts)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get banks')
    }   
})

router.get('/platform-balances', async ( req, res) => {
    try {
        const balances = await getTraderBalances(req.session.passport.user)
        res.status(200).json(balances)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get balances')
    }    
})

router.post('/add', async (req, res) => {
    try {
        const trader = await getTrader(req.session.passport.user)
        const existingAccount = await checkTraderAccountDuplicate(req.body)
        if (existingAccount) {
            res.status(400).json("Account already exists")
        } else {
            req.body.traderId = trader.trader_id
            const balances = await addBankAccount(req.body)
            res.status(201).json("success")
        }
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get providers')
    }   
})


router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router