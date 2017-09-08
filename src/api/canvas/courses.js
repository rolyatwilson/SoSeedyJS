var request = require('request')
const constants = require('../constants.js')
const canvasDomain = constants.CANVAS_DOMAIN
const adminToken = `Bearer ${constants.ACCOUNT_ADMIN['token']}`
const baseUrl = `https://${canvasDomain}/api/v1/accounts/self`
const random = require('../../random/index.js')

export function createCourse(callback) {
  let courseName = random.courseName()
  let body = {
    course: {
      name: courseName,
      course_code: courseName.substring(0, 2)
    },
    offer: true
  }

  let options = {
      url: `${baseUrl}/courses`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': adminToken
      },
      body: JSON.stringify(body)
  }

  request(options, (err, response, body) => {
    if (err || response.statusCode != 200) {
      callback(null, err)
    } else {
      callback(JSON.parse(body), null)
    }
  })
}
