const express = require('express')
const server = express()
const canvas = require('./api/canvas/oauth2.js')
const path = require('path')

server.get('/', (req, res) => {
    console.log(req.headers)
    res.sendFile(path.join(__dirname + '/html/index.html'))
})

server.get('/tokens', (req, res) => {

    console.log('/tokens')
    console.log(req.query)
    console.log('-------')
    let user = req.query
    let loginId = user.loginId
    let password = user.password
    
    if (!loginId || !password) {
        res.send('Oops, that sucks')
        return
    }
    
    canvas.getToken(user, (token, err) => {
        if (err) {
            res.send(`that didn't go so well did it? ${err}`)
        } else {
            res.send(`here's an access token for you :) --> ${token}`)
        }
    })
})

server.listen(3000, () => {
    console.log('Server listening on port 3000!')
})


