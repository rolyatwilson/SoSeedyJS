const canvas = require('./build/api/canvas/oauth2.js')

let user = {
    loginId: 'teacher1',
    password: 'password'
}

canvas.getToken(user, (user, token) => {
    console.log('user -> ' + user.loginId)
    console.log('token -> ' + token)
})
