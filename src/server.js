const express = require('express')
const server = express()
const canvas = require('./api/canvas/oauth2.js')
const path = require('path')

server.set('views', path.join(__dirname, '../public/views'))
server.set('view engine', 'ejs')

server.get('/', (req, res) => {
    res.render('pages/index')
})

server.get('/tokens', (req, res) => {
    let user = req.query
    let loginId = user.loginId
    let password = user.password
    
    if (!loginId || !password) {
        res.render('pages/token')
        return
    }
    
    canvas.getToken(user, (token, err) => {
        if (err) {
            res.render('pages/token_failure')
        } else {
            res.render('pages/token_success', {
                token: token
            })
        }
    })
})

server.listen(3000, () => {
    console.log('Server listening on port 3000!')
})


