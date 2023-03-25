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

const addBankAccount = (body) => {
    return dbService.addBankAccount(body)
}

const getAllBanks = () => {
    return dbService.getAllBanks()
}

const checkTraderAccountDuplicate = (body) => {
    return dbService.getOneTraderAccount(body)
}


module.exports = { 
    getTraderAccounts,
    getTraderBalances,
    setDefaultBalances,
    addBankAccount,
    getAllBanks,
    checkTraderAccountDuplicate
}
