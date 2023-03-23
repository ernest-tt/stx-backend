const dbService = require('../dbService')

const bcrypt = require('bcrypt')

const registerNewTrader = async (body) => {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword
    return dbService.registerNewTrader(body)
}

const getTrader = async (email) => {
    return dbService.getTrader(email)
}

module.exports = { 
    registerNewTrader,
    getTrader
}

