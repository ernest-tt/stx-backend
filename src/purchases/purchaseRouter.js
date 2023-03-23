const express = require('express')
const router = express.Router()
const { } = require('./purchaseService')


router.get('/all', async (req, res) => {
    try {
        const providers = await getAllProviders()
        res.status(201).json(providers)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get providers')
    }
})

router.get('/offers', async (req, res) => {
    try {
        const offers = await getAllOffers()
        res.status(201).json(offers)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get offers')
    }
})

router.get('/offers/:id', async (req, res) => {
    try {
        const offers = await getOffersFromProvider(req.params.id)
        res.status(201).json(offers)
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('Could not get provider offers')
    }
})


router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router