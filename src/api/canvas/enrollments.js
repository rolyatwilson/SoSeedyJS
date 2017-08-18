var request = require('request')
const constants = require('../constants.js')
const canvasDomain = constants.CANVAS_DOMAIN
const adminToken = `Bearer ${constants.ACCOUNT_ADMIN['token']}`
const baseUrl = `https://${canvasDomain}/api/v1/`

export function enrollUser(course, userId, enrollmentType, callback) {
  if (!userId) {
    console.log('oh darn')
    return
  }

  let body = {
    enrollment: {
      user_id: userId,
      type: enrollmentType,
      enrollment_state: 'active'
    }
  }

  let options = {
      url: `${baseUrl}courses/${course.id}/enrollments`,
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