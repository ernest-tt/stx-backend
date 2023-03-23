const dbService = require('../dbService')

const getAllProviders = () => {
    return dbService.getAllProviders()
}

const getAllOffers = () => {
    return dbService.getAllOffers()
}

const getOffersFromProvider = (providerId) => {
    return dbService.getOffersFromProvider(providerId)
}

module.exports = { 
    getAllProviders,
    getAllOffers,
    getOffersFromProvider
}

