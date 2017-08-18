var request = require('request')
const constants = require('../constants.js')
const canvasDomain = constants.CANVAS_DOMAIN
const adminToken = `Bearer ${constants.ACCOUNT_ADMIN['token']}`
const baseUrl = `https://${canvasDomain}/api/v1/`

export function favoriteCourse(userToken, courseId, callback) {
  let options = {
    url: `${baseUrl}/users/self/favorites/courses/${courseId}`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
    }
  }

  request(options, (err, response, body) => {
    if (err || response.statusCode != 200) {
      callback(null, err)
    } else {
      callback(JSON.parse(body), null)
    }
  })
}
