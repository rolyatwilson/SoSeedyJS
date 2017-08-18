var request = require('request')
const constants = require('../constants.js')
const canvasDomain = constants.CANVAS_DOMAIN
const adminToken = `Bearer ${constants.ACCOUNT_ADMIN['token']}`
const baseUrl = `https://${canvasDomain}/api/v1/accounts/self`
const random = require('../../random/index.js')

export function createUser(callback) {
  let userName = random.userName()
  let userNameTokens = userName.split(' ')
  let body = {
    user: {
      name: userName,
      short_name: userNameTokens[0],
      sortable_name: `${userNameTokens[1]}, ${userNameTokens[0]}`,
      terms_of_use: true
    },
    pseudonym: {
      unique_id: random.userLoginId(),
      password: random.userPassword()
    },
    communication_channel: {
      skip_confirmation: true
    }
  }
  let options = {
    url: `${baseUrl}/users`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': adminToken
    },
    body: JSON.stringify(body)
  }
  
  request(options, (err, response, body) => {
    if (err || response.statusCode != 200) {
      callback(null, 'Failed to create user!')
    } else {
      callback(JSON.parse(body), null)
    }
  })
}
