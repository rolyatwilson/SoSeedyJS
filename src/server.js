const express = require('express')
const server = express()
const path = require('path')
const Time = require('time-diff')
const canvasOauth2 = require('./api/canvas/oauth2.js')
const canvasCourses = require('./api/canvas/courses.js')
const canvasEnrollments = require('./api/canvas/enrollments.js')
const canvasUsers = require('./api/canvas/users.js')

server.set('views', path.join(__dirname, '../public/views'))
server.set('view engine', 'ejs')

server.get('/', (req, res) => {
  res.render('pages/index')
})

server.get('/users', (req, res) => {
  let user = req.query
  let loginId = user.loginId
  let password = user.password
  let firstName = user.firstName
  let lastName = user.lastName
  let courses = user.courses
  let enrollmentType = user.enrollmentType
  
  if (!loginId || !password || !firstName || !lastName || !courses || !enrollmentType) {
    res.render('pages/users')
    return
  }

  let time = new Time()
  time.start(loginId)
  let rendered = false
  canvasUsers.createUser(user, (response, err) => {
    if (err || !response) {
      if (!rendered) {
        rendered = true
        res.render('pages/users_failure')
      }
      return
    }

    let userId = response.id
    for (let i = 0; i < courses; i++) {
      if (rendered) {
        return
      }
      canvasCourses.createCourse((course, err) => {
        if (err || course === null) {
          if (!rendered) {
            rendered = true
            res.render('pages/users_failure')
          }
          return
        }
        canvasEnrollments.enrollUser(course, userId, enrollmentType, (enrollment, err) => {
          if (err || enrollment === null) {
            if (!rendered) {
              rendered = true
              res.render('pages/users_failure')
            }
            return
          }
          if (i == courses - 1) {
            res.render('pages/users_success', {
              user: loginId, 
              courses: courses,
              enrollmentType: enrollmentType,
              timeElapsed: time.end(loginId)
            })
          }
        })
      })
    }
  })
})

server.get('/tokens', (req, res) => {
  let user = req.query
  let loginId = user.loginId
  let password = user.password
  
  if (!loginId || !password) {
    res.render('pages/token')
    return
  }
  
  canvasOauth2.getToken(user, (token, err) => {
    if (err) {
      res.render('pages/token_failure')
    } else {
      res.render('pages/token_success', {
        token: token
      })
    }
  })
})

server.get('/settings', (req, res) => {
  res.render('pages/settings', {
    domain: canvasOauth2.canvasDomain,
    clientId: canvasOauth2.clientId,
    clientSecret: canvasOauth2.clientSecret
  })
})

server.listen(3000, () => {
  console.log('Server listening on port 3000!')
})
