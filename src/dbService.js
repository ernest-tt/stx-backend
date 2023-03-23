const pool = require('./db')

const registerNewTrader = async (body) => {
    return pool.query(
        "INSERT INTO traders(name, email, password) VALUES($1, $2, $3)", 
        [body.name, body.email, body.password]
    ).then((res) => {
        return pool.query(
            'SELECT email, name FROM traders where email = $1', [body.email]
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


module.exports = {
    registerNewTrader,
    getTrader,
    getAllProviders,
    getAllOffers,
    getOffersFromProvider,
    getTraderAccounts,
    createPurchaseRequest,
    getAllRequests,
    getRequestDetails
}