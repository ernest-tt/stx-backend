if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const cookieParser = require("cookie-parser")
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
const traderRouter = require('./trader/traderRouter')
const providerRouter = require('./providers/providerRouter')
const purchaseRouter = require('./purchases/purchaseRouter')
const accountRouter = require('./accounts/accountRouter')

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


app.use('/trader', traderRouter)

app.use('/providers', checkAuthenticated, providerRouter)

app.use('/purchase', checkAuthenticated, purchaseRouter)

app.use('/accounts', checkAuthenticated, accountRouter)

app.delete('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {return next(err)}
    })
    res.clearCookie('connect.sid')
    res.status(200).send('logout success')
})

app.get('*', checkAuthenticated, (req, res) => {
    res.status(404).json("Not found")
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    } else {
        res.status(401).send('Unauthorized')
    }
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        res.send('authenticated').status(200)
    }
    next()
}

app.listen(5000, () => {
    console.log('Listening on port 5000')
})