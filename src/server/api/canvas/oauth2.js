var request = require('request')
const constants = require('../constants.js')
const canvasDomain = constants.CANVAS_DOMAIN
const clientId = constants.DEVELOPER_KEY['clientId']
const clientSecret = constants.DEVELOPER_KEY['clientSecret']
const redirectUri = constants.DEVELOPER_KEY['redirectUri']
const baseUrl = `https://${canvasDomain}`

export function getToken(user, callback) {
    getLoginForm((cookieJar) => {
        postLoginForm(user, cookieJar, (cookieJar) => {
            postAcceptForm(cookieJar, (authorizationCode) => {
                oauth2AccessToken(authorizationCode, (accessToken) => {
                    console.log(`Returning token: ${accessToken} for loginID: ${user.loginId}`)
                    callback(user, accessToken)
                })
            })
        })
    })
}

export function getLoginForm(callback) {
    let cookieJar = request.jar()
    let options = {
        url: `${baseUrl}/login/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`,
        method: 'GET',
        followRedirect: true,
        jar: cookieJar
    }
    request(options, (err, response, body) => {
        callback(cookieJar)
    })
}

export function postLoginForm(user, cookieJar, callback) {
    let options = {
        url: `${baseUrl}/login/canvas`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: { 
            'pseudonym_session[unique_id]': user.loginId, 
            'pseudonym_session[password]': user.password, 
            'pseudonym_session[remember_me]': 0,
            'redirect_to_ssl': 1,
            'authenticity_token': authenticityTokenFromCookieJar(cookieJar)
        },
        followRedirect: true,
        jar: cookieJar
    }
    request(options, (err, response, body) => {
        callback(cookieJar)
    })
}

export function postAcceptForm(cookieJar, callback) {
    let options = {
        url: `${baseUrl}/login/oauth2/accept`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'authenticity_token': authenticityTokenFromCookieJar(cookieJar)
        },
        followRedirect: false,
        jar: cookieJar
    }
    request(options, (err, response, body) => {
        let authorizationCode = response.headers['location'].match(/\?code=(.*)/)[1]
        callback(authorizationCode)
    })
}

export function oauth2AccessToken(authorizationCode, callback) {
    let options = {
        url: `${baseUrl}/login/oauth2/token`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'grant_type': 'authorization_code',
            'client_id': clientId,
            'client_secret': clientSecret,
            'redirect_uri': redirectUri,
            'code': authorizationCode
        }
    }
    request(options, (err, response, body) => {
        let accessToken = JSON.parse(body)['access_token'] 
        callback(accessToken)
    })
}

export function authenticityTokenFromCookieJar(cookieJar) {
    let csrfToken = decodeURIComponent(cookieJar.getCookieString(baseUrl).split(' ')[0])
    return csrfToken.substring(12, csrfToken.length -1)
}
