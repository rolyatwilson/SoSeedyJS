console.log('SoSeedy from Node.js')

var request = require('request')

const baseUrl = 'https://twilson.test.instructure.com'

const clientId = '60400000000000005'
const redirectUri = 'urn:ietf:wg:oauth:2.0:oob'
const responseType = 'code'

const authorizationCodeUrl = `${baseUrl}/login/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`
const credentialsFormPostUrl = `${baseUrl}/login/canvas`

console.log(authorizationCodeUrl)

var options = {
    url: authorizationCodeUrl,
    method: 'GET',
    followRedirect: false
}

function delim(a, b) {
    var d = '================================================================================'
    console.log(d)
    console.log(d)
    console.log(a)
    console.log(d)
    console.log(b)
    console.log(d)
    console.log(d)
}

var j = request.jar()
var options = {
    url: authorizationCodeUrl,
    method: 'GET',
    followRedirect: true,
    jar: j
}

request(options, (e, r, body) => {
    delim('GET login/oauth2', r.headers)

    var csrf_token = decodeURIComponent(j.getCookieString('https://twilson.test.instructure.com').split(' ')[0])
    var authenticity_token = csrf_token.substring(12, csrf_token.length -1)

    var options = {
        url: `${baseUrl}/login/canvas`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: { 
            'pseudonym_session[unique_id]': 'teacher1', 
            'pseudonym_session[password]': 'password', 
            'pseudonym_session[remember_me]': 0,
            'redirect_to_ssl': 1,
            'authenticity_token': authenticity_token
        },
        followRedirect: false,
        jar: j
    }

    request(options, (e, r, body) => {
        delim('POST login/canvas')
        console.log(r.headers)
    })
})

