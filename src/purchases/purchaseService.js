const dbService = require('../dbService')

const createPurchaseRequest = (body) => {
    return dbService.createPurchaseRequest(body)
}

const getAllRequests = (email) => {
    return dbService.getAllRequests(email)
}

const getRequestDetails = (email, requestId) => {
    return dbService.getRequestDetails(email, requestId)
}

module.exports = { 
    createPurchaseRequest,
    getAllRequests,
    getRequestDetails
}
