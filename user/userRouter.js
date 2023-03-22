const express = require('express')
const router = express.Router()
const passport = require('passport')
const { registerNewTrader, getTrader } = require('./userService')



const initializePassport = require('../passport-config');
initializePassport(passport,
     email => getTrader(email),
     id => users.find(user => user.id === id)
);


router.post('/register', async (req, res) => {
    try {
        const newTrader = await registerNewTrader(req.body)
        res.status(201).send("success")
    } catch (error) {
        console.error(error)
        res.status(error?.status || 500).send('could not register user')
    }
})

router.post('/login',
    passport.authenticate('local', {
        failureMessage: true,
        failureFlash: true
    }),
    (req, res) => {
        res.status(200).json('success')
    }
)

router.get('*', (req, res) => {
    res.status(404).json("Not found")
})

module.exports = router