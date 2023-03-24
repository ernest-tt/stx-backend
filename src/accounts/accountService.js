const dbService = require('../dbService')

const getTraderAccounts = (email) => {
    return dbService.getTraderAccounts(email)
}

const getTraderBalances = (email) => {
    return dbService.getTraderBalances(email)
}

const setDefaultBalances = (trader_id) => {
    return dbService.setDefaultBalances(trader_id)
}


module.exports = { 
    getTraderAccounts,
    getTraderBalances,
    setDefaultBalances
}
