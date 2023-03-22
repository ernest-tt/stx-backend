if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const cors = require('cors');
const userRouter = require('./user/userRouter')


app.use(express.json())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(cors())
app.use(passport.initialize())
app.use(passport.session())


app.use('/user', userRouter)


app.get('/', checkAuthenticated, (req, res) => {
    res.send('<h1>Hi</h1>')
})

app.delete('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {return nex(err)}
    })
    res.status(200).send('logout success')
})

app.get('*', (req, res) => {
    res.status(404).json("Not found")
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }
    res.status(401).send('Unauthorized')
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        res.send('authenticated').status(200)
    }
    next()
}

app.listen(3000, () => {
    console.log('Listening on port 3000')
})