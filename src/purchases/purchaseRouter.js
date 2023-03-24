const express = require('express')
const router = express.Router()
const { createPurchaseRequest, getAllRequests, getRequestDetails } = require('./purchaseService')
const { getTrader } = require('../trader/traderService')


router.post('/create-request', async (req, res) => {
    try {
        //get traderId from session
        const traderId = await getTrader(req.session.passport.user)
        req.body.traderId = traderId.trader_id
        req.body.email = req.session.passport.user
        const purchaseRequest = await createPurchaseRequest(req.body)
        res.status(201).json(purchaseRequest)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not create purchase request')
    }
})

router.get('/all', async (req, res) => {
    try {
        const allRequests = await getAllRequests(req.session.passport.user)
        if (allRequests.length != 0) {
            res.status(200).send(allRequests)
        } else {
            res.status(404).json('No requests found')
        }
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not fetch requests')
    }    
})

router.get('/request/:id', async (req, res) => {
    try {
        const requestDetails = await getRequestDetails(req.session.passport.user, req.params.id)
        if (requestDetails) {
            res.status(200).json(requestDetails)
        } else {
            res.status(404).json('No request found')
        }

    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not fetch requests')
    }     
})


router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router