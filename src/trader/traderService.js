const dbService = require('../dbService')

const bcrypt = require('bcrypt')

const registerNewTrader = async (body) => {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword
    const newTrader = await dbService.registerNewTrader(body)
    return dbService.setDefaultBalances(newTrader.trader_id)
}

const getTrader = async (email) => {
    return dbService.getTrader(email)
}

module.exports = { 
    registerNewTrader,
    getTrader
}

