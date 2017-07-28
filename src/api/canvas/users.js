var request = require('request')
const constants = require('../constants.js')
const canvasDomain = constants.CANVAS_DOMAIN
const adminToken = `Bearer ${constants.ACCOUNT_ADMIN['token']}`
const baseUrl = `https://${canvasDomain}/api/v1/accounts/1`

export function createUser(user, callback) {
  let body = {
    user: {
      name: `${user.firstName} ${user.lastName}`,
      short_name: user.firstName,
      sortable_name: `${user.lastName}, ${user.firstName}`,
      terms_of_use: true
    },
    pseudonym: {
      unique_id: user.loginId,
      password: user.password
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
