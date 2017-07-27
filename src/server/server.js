const express = require('express')
const server = express()
const canvas = require('./api/canvas/oauth2.js')

server.get('/', (req, res) => {
    console.log(req.headers)
    res.send('Hello World!')
})

server.get('/tokens', (req, res) => {
    let user = req.query
    let loginId = user.loginId
    let password = user.password
    
    if (!loginId || !password) {
        res.send('Oops, that sucks')
        return
    }
    
    canvas.getToken(user, (user, token) => {
        res.send(`here's an access token for you :) --> ${token}`)
    })
})

server.listen(3000, () => {
    console.log('Server listening on port 3000!')
})




// example for calling canvas.getToken()
// const canvas = require('./api/canvas/oauth2.js')

// let user = {
//     loginId: 'teacher1',
//     password: 'password'
// }


