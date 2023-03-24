const express = require('express')
const router = express.Router()
const passport = require('passport')
const { registerNewTrader, getTrader } = require('./traderService')



const initializePassport = require('../passport-config');
initializePassport(passport,
     email => getTrader(email),
);


router.post('/register', async (req, res) => {
    try {
        const newTrader = await registerNewTrader(req.body)
        res.status(201).json(newTrader)
    } catch (error) {
        console.error(error)
        if (error.message.includes("duplicate")) {
            res.status(error?.status || 500).send('A user with this email already exists')            
        } else {
            res.status(error?.status || 500).send('Could not register new user')
        }
    }
})

router.post('/login',
    passport.authenticate('local', {
        failureMessage: true,
        failureFlash: true
    }), 
    (req, res) => {
        res.send('ok')
    }
)

router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router