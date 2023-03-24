const pool = require('./db')

const registerNewTrader = async (body) => {
    return pool.query(
        "INSERT INTO traders(name, email, password) VALUES($1, $2, $3)", 
        [body.fullName, body.email, body.password]
    ).then((res) => {
        return pool.query(
            'SELECT trader_id, email, name FROM traders where email = $1', [body.email]
        ).then((res) => {return res.rows[0]})
    })
    .catch(err => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getTrader = async (email) => {
    return pool.query(
        "SELECT * FROM traders WHERE email = $1", [email]
    ).then((res) => {
        return res.rows[0]
    })
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getAllProviders = () => {
    return pool.query(
        'SELECT * FROM providers'
    )
    .then((res) => {return res.rows})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getAllOffers = () => {
    return pool.query(
       `SELECT p.provider_id, p.name, 
        r.offer_id, r.name as currency_name, 
        r.symbol, r.selling_price, 
        r.buying_price
        FROM providers p 
        INNER JOIN (
            select c.name, c.symbol, o.* from currencies c 
            INNER JOIN offers o 
            ON c.currency_id = o.currency_id 	
        ) AS r
        ON p.provider_id = r.provider_id` 
    )
    .then((res) => {return res.rows})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getOffersFromProvider = (providerId) => {
    return pool.query(
        `SELECT p.name, r.offer_id, r.name as currency_name, 
        r.symbol, r.selling_price, 
        r.buying_price
        FROM providers p 
        INNER JOIN (
            select c.name, c.symbol, o.* from currencies c 
            INNER JOIN offers o 
            ON c.currency_id = o.currency_id 	
        ) AS r
        ON p.provider_id = r.provider_id
        WHERE p.provider_id = $1`, [providerId] 
    )
    .then((res) => {return res.rows})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getTraderAccounts = (email) => {
    return pool.query(
        `SELECT a.account_id, b.bank_name, a.account_number FROM accounts a
         INNER JOIN traders t 
         ON t.trader_id  = a.trader_id 
         INNER JOIN banks b
         ON b.bank_id = a.bank_id 
         WHERE t.email = $1`, [email]
    )
    .then((res) => {return res.rows})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const setDefaultBalances = (trader_id) => {
    return pool.query(
        `insert into trader_balances (trader_id, currency_id, amount)
         values($1, 1, 20000)`, [trader_id]
    )
}

const getTraderBalances = (email) => {
    return pool.query(
        `SELECT trader_balance_id, c.currency_id, c.symbol, amount  from trader_balances tb
         INNER JOIN currencies c 
         ON tb.currency_id = c.currency_id
         INNER JOIN traders t
         ON tb.trader_id = t.trader_id 
         WHERE t.email = $1`, [email]
    )
    .then((res) => {return res.rows})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const createPurchaseRequest = (body) => {
    return pool.query(
        `INSERT INTO requests (trader_id, offer_id, provider_id , amount, account_id)
         VALUES ($1, $2, $3, $4, $5)`, [body.traderId, body.offerId, body.providerId, body.amount, body.accountId]
    )
    .then((res) => {return res.rows})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getAllRequests = (email) => {
    return pool.query(
        `SELECT r.request_id, r.amount, r.request_date, r.status,
         c.symbol , p.name
         FROM requests r 
         INNER JOIN traders t ON r.trader_id = t.trader_id
         INNER JOIN offers o ON r.offer_id = o.offer_id
         INNER JOIN currencies c ON o.currency_id = c.currency_id 
         INNER JOIN providers p ON r.provider_id = p.provider_id 
         INNER JOIN accounts a ON r.account_id = a.account_id 
         INNER JOIN banks b ON a.bank_id = b.bank_id 
         WHERE email = $1`, [email]
    )
    .then((res) => {return res.rows})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getRequestDetails = (email, requestId) => {
    return pool.query(
        `SELECT r.request_id, r.amount, r.request_date, r.status,
         o.selling_price , o.buying_price , c.symbol , p.name, b.bank_name 
         FROM requests r 
         INNER JOIN traders t ON r.trader_id = t.trader_id
         INNER JOIN offers o ON r.offer_id = o.offer_id
         INNER JOIN currencies c ON o.currency_id = c.currency_id 
         INNER JOIN providers p ON r.provider_id = p.provider_id 
         INNER JOIN accounts a ON r.account_id = a.account_id 
         INNER JOIN banks b ON a.bank_id = b.bank_id 
         WHERE email = $1 AND request_id = $2`, [email, requestId]
    )
    .then((res) => {return res.rows[0]})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const addBankAccount = (body) => {
    return pool.query(
        `INSERT INTO accounts (trader_id, bank_id , account_number )
         VALUES($1, $2, $3)`, [body.traderId, body.bankId, body.accountNumber]
    )
    .then((res) => {return res.rows[0]})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const getProviderBalance = (body) => {
    return pool.query(
        `SELECT DISTINCT o.currency_id , o.selling_price , pb.amount FROM offers o 
         INNER JOIN provider_balances pb 
         ON o.provider_id = pb.provider_id 
         WHERE o.provider_id = $1 AND o.offer_id = $2;`, [body.providerId, body.offerId]
    )
    .then((res) => {return res.rows[0]})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const updateProviderBalance = (body) => {
    return pool.query(
        `update provider_balances 
        set amount = $1
        where provider_id = $2 and currency_id = $3`, [body.newBalance, body.providerId, body.currencyId]
    )
    .then((res) => {return res.rows[0]})
    .catch((err) => {
        throw { status: err?.status || 500, message: err.message }
    })
}

const updateTraderBalance = (body) => {
    return pool.query(
        `update trader_balances 
        set amount = $1
        where trader_balance_id = $2 and currency_id = $3`, [body.newTraderBalance, body.traderBalanceId, body.currencyId]
    )
}

module.exports = {
    registerNewTrader,
    getTrader,
    getAllProviders,
    getAllOffers,
    getOffersFromProvider,
    setDefaultBalances,
    addBankAccount,
    getTraderAccounts,
    getTraderBalances,
    createPurchaseRequest,
    getAllRequests,
    getRequestDetails,
    getProviderBalance,
    updateProviderBalance,
    updateTraderBalance
}