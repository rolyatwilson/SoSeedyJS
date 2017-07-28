var request = require('request')
const constants = require('../constants.js')
const canvasDomain = constants.CANVAS_DOMAIN
const clientId = constants.DEVELOPER_KEY['clientId']
const clientSecret = constants.DEVELOPER_KEY['clientSecret']
const redirectUri = constants.DEVELOPER_KEY['redirectUri']
const baseUrl = `https://${canvasDomain}`

export function getToken(user, callback) {
    getLoginForm((cookieJar, err) => {
        if (err) {
            callback(null, err)
        } else {
            postLoginForm(user, cookieJar, (cookieJar) => {
                if (err) {
                    callback(null, err)
                } else {
                    postAcceptForm(cookieJar, (authorizationCode, err) => {
                        if (err) {
                            callback(null, err)
                        } else {
                            oauth2AccessToken(authorizationCode, (accessToken, err) => {
                                console.log(`Returning token: ${accessToken} for loginID: ${user.loginId}`)
                                callback(accessToken, err)
                            })
                        }
                    })
                }
            })
        }
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
        if (err) {
            callback(null, err)
        } else {
            callback(cookieJar, null)
        }
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
        if (err) {
            callback(null, err)
        } else {
            callback(cookieJar, null)
        }        
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
        let redirectLocation = response.headers['location']
        if (err) {
            callback(null, err)
        } else if (!redirectLocation){
            callback(null, { error: 'Redirect Location Not Found' })
        } else {
            let authorizationMatch = redirectLocation.match(/\?code=(.*)/)
            if (!authorizationMatch) {
                console.log('error here')
                callback(null, { error: 'Authorization Code Not Found' })
            } else {
                console.log('success here')
                let authorizationCode = authorizationMatch[1]
                callback(authorizationCode, err)
            }
        }
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
        if (err || !accessToken) {
            callback(null, err)
        } else {
            callback(accessToken, null)
        }
    })
}

export function authenticityTokenFromCookieJar(cookieJar) {
    let csrfToken = decodeURIComponent(cookieJar.getCookieString(baseUrl).split(' ')[0])
    return csrfToken.substring(12, csrfToken.length -1)
}
