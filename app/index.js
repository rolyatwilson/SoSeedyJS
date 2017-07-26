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

function printCookies(jar) {
    console.log(jar.getCookies('https://twilson.test.instructure.com'))
}

var log_session_id = ''

// request(options, (e, r, body) => {
//     delim('GET login/oauth2')
//     console.log(r.headers)

//     log_session_id = decodeURIComponent(r.headers['set-cookie'][1])

//     var new_cookies = r.headers['set-cookie']

//     delim(new_cookies)

//     new_cookies.push(log_session_id)

//     var options = {
//         url: r.headers['location'],
//         method: 'GET',
//         headers: {
//             'Cookie': new_cookies,
//         },
//         followRedirect: false
//     }

//     request(options, (e, r, body) => {
//         delim('GET login')
//         console.log(r.headers)

//         var new_cookies = r.headers['set-cookie']
//         new_cookies.push(log_session_id)
        
//         var options = {
//             url: r.headers['location'],
//             method: 'GET',
//             headers: {
//                 'Cookie': new_cookies
//             }
//         }

//         request(options, (e, r, body) => {
//             delim('GET login/canvas')
//             console.log(r.headers)

//             var new_cookies = r.headers['set-cookie']
//             new_cookies.push(log_session_id)

//             var csrf_string = decodeURIComponent(r.headers['set-cookie'][0].split(' ')[0])
//             var csrf_token = csrf_string.substring(12, csrf_string.length -1)

//             var options = {
//                 url: credentialsFormPostUrl,
//                 method: 'POST',
//                 headers: {
//                     'Cookie': new_cookies,
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }, 
//                 form: { 
//                     'pseudonym_session[unique_id]': 'teacher1', 
//                     'pseudonym_session[password]': 'password', 
//                     'pseudonym_session[remember_me]': 0,
//                     'redirect_to_ssl': 1,
//                     'authenticity_token': csrf_token
//                 },
//                 followRedirect: false
//             }

//             request(options, (e, r, body) => {
//                 delim('POST login/canvas')
//                 console.log(r.headers)
//             })
//         })
//     })
// })

// request
//     .get(authorizationCodeUrl)
//     .on('response', (response) => {
//         console.log(response.statusCode)
//         console.log(response.headers['set-cookie'])

//         var cookies = response.headers['set-cookie']

//         var csrf_string = decodeURIComponent(cookies[0].split(' ')[0])
//         var csrf_token = csrf_string.substring(12, csrf_string.length -1)

//         console.log(csrf_token)
//         console.log('===================================')

//         var headers = {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Cookie': cookies.join('; ')
//         }

//         console.log(headers)

//         var options = {
//             url: `${baseUrl}/login/canvas`,
//             method: 'POST',
//             headers: headers,
//             form: { 
//                 'pseudonym_session[unique_id]': 'teacher1', 
//                 'pseudonym_session[password]': 'password', 
//                 'pseudonym_session[remember_me]': 0,
//                 'redirect_to_ssl': 1,
//                 'authenticity_token': csrf_token
//             },
//             followRedirect: false
//         }

//         request.post(options, (e, r, body) => {
//             console.log('================')
//             console.log('what do we have here?')
//             console.log(r.statusCode)
//             console.log(r.headers)
//             console.log('================')
//         })
        
//     })


var j = request.jar()

var options = {
    url: authorizationCodeUrl,
    method: 'GET',
    followRedirect: true,
    jar: j
}

request(options, (e, r, body) => {
    delim('GET login/oauth2', r.headers)
    printCookies(j)


    // var csrf = j.getCookies('https://twilson.test.instructure.com')[0]

    // console.log('what about this -->')
    // console.log(j.getCookieString('https://twilson.test.instructure.com'))


    // console.log('csrf -->')
    // console.log(csrf)

    // console.log(Object.prototype.toString.call(csrf))

    var csrf_token = decodeURIComponent(j.getCookieString('https://twilson.test.instructure.com').split(' ')[0])
    var authenticity_token = csrf_token.substring(12, csrf_token.length -1)
    console.log(authenticity_token)

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





// request
//     .get(authorizationCodeUrl)
//     .on('response', (response) => {
//         console.log(response.statusCode)
//         console.log(response.headers['set-cookie'])

//         var cookies = response.headers['set-cookie']

//         var csrf_string = decodeURIComponent(cookies[0].split(' ')[0])
//         var csrf_token = csrf_string.substring(12, csrf_string.length -1)

//         console.log(csrf_token)
//         console.log('===================================')

//         var headers = {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Cookie': cookies.join('; ')
//         }

//         console.log(headers)

//         var options = {
//             url: `${baseUrl}/login/canvas`,
//             method: 'POST',
//             headers: headers,
//             form: { 
//                 'pseudonym_session[unique_id]': 'teacher1', 
//                 'pseudonym_session[password]': 'password', 
//                 'pseudonym_session[remember_me]': 0,
//                 'redirect_to_ssl': 1,
//                 'authenticity_token': csrf_token
//             },
//             followRedirect: false
//         }

//         request.post(options, (e, r, body) => {
//             console.log('================')
//             console.log('what do we have here?')
//             console.log(r.statusCode)
//             console.log(r.headers)
//             console.log('================')
//         })
        
//     })
