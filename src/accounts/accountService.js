const dbService = require('../dbService')

const getTraderAccounts = (email) => {
    return dbService.getTraderAccounts(email)
}


module.exports = { 
    getTraderAccounts
}
