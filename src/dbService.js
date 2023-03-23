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


module.exports = {
    registerNewTrader,
    getTrader,
    getAllProviders,
    getAllOffers,
    getOffersFromProvider
}