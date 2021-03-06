const express = require('express')
const server = express()
const path = require('path')
const Time = require('time-diff')
const canvasOauth2 = require('./api/canvas/oauth2.js')
const canvasCourses = require('./api/canvas/courses.js')
const canvasFavorites = require('./api/canvas/favorites.js')
const canvasEnrollments = require('./api/canvas/enrollments.js')
const canvasUsers = require('./api/canvas/users.js')

server.set('views', path.join(__dirname, '../public/views'))
server.set('view engine', 'ejs')

server.get('/', (req, res) => {
  res.render('pages/index')
})

server.get('/users', (req, res) => {
  let query = req.query
  let courses = query.courses
  let enrollmentType = query.enrollmentType
  
  if (!courses || !enrollmentType) {
    res.render('pages/users')
    return
  }

  let requestTime = new Date().getTime()
  let time = new Time()
  time.start(requestTime)
  let rendered = false
  canvasUsers.createUser((response, err) => {
    if (err || !response) {
      if (!rendered) {
        rendered = true
        res.render('pages/users_failure')
      }
      return
    }

    let user = response
    let allCourses = []
    let allEnrollments = []
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
        allCourses.push(course)
        canvasEnrollments.enrollUser(course, user.id, enrollmentType, (enrollment, err) => {
          if (err || enrollment === null) {
            if (!rendered) {
              rendered = true
              res.render('pages/users_failure')
            }
            return
          }
          allEnrollments.push(enrollment)
          if (i == courses - 1) {
            res.send(JSON.stringify({
              user: {
                login_id: user.login_id,
                password: 'password'
              },
              courses: allCourses,
              enrollments: allEnrollments
            }))
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
      res.send(JSON.stringify({
        token: token
      }))
    }
  })
})

server.post('/favorites', (req, res) => {
  var jsonString = ''
  req.on('data', (data) => {
    jsonString += data
  })

  req.on('end', () => {
    let json = JSON.parse(jsonString)
    let token = json.token
    let courseId = json.courseId

    if (!token || !courseId) {
      res.render('pages/favorites_failure')
      return
    }

    canvasFavorites.favoriteCourse(token, courseId, (favorite, err) => {
      if (err) {
        res.render('pages/favorites_failure')
      } else {
        res.send(JSON.stringify({
          favorite: favorite
        }))
      }
    })
  })
})

server.get('/settings', (req, res) => {
  res.render('pages/settings', {
    domain: canvasOauth2.canvasDomain,
    clientId: canvasOauth2.clientId
  })
})

server.listen(3000, () => {
  console.log('Server listening on port 3000!')
})
