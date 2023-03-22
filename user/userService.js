const pool = require('../db')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt')

const registerNewTrader = async (body) => {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    return pool.query(
        "INSERT INTO traders(trader_id, name, email, password) VALUES($1, $2, $3, $4)", 
        [v4(), body.name, body.email, hashedPassword]
    ).then((res) => console.log("new user registered"))
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



module.exports = {
    registerNewTrader,
    getTrader
}