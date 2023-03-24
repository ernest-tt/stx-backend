const dbService = require('../dbService')

const createPurchaseRequest = async (body) => {
    try {
        const traderBalance = await dbService.getTraderBalances(body.email)
        const floatTraderBalance = parseFloat(traderBalance[0].amount.slice(1).replaceAll(',',''))

        //check trader balance
        if( floatTraderBalance > body.amount ){
            const providerBalance = await dbService.getProviderBalance(body)
            const floatProviderBalance = parseFloat(providerBalance.amount.slice(1).replaceAll(',',''))
            const floatSellingRate = parseFloat(providerBalance.selling_price.slice(1).replaceAll(',',''))
            console.log(floatSellingRate)

            //check provider balance
            if ( floatProviderBalance >= (body.amount / floatSellingRate)) {
                const request = await dbService.createPurchaseRequest(body);
                const newBalance = floatProviderBalance - (body.amount / floatSellingRate) 
                const update = await dbService.updateProviderBalance({
                    newBalance: newBalance.toFixed(2), providerId: body.providerId, 
                    currencyId: providerBalance.currency_id
                })
                
                
                return dbService.updateTraderBalance({
                    newTraderBalance: floatTraderBalance - body.amount,
                    traderBalanceId: traderBalance[0].trader_balance_id,
                    currencyId: traderBalance[0].currency_id
                })

            } else {
                throw new Error('Cannot fulfill request')
            }
        }
    } catch (err) {
        console.error(err)
        throw err
    }
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
