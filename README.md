# SoSeedyJS
Proof of Concept Node.js service for seeding data.

## Setup
- `npm install`
- `npm start`

## Usage
Service will run on `localhost:3000`.

`GET /users?courses=3&enrollmentType=TeacherEnrollment`

  - creates 1 user, 3 courses, and enrolls the user into each course as a teacher

`GET /tokens?loginId=someEmail&password=somePassword`

  - creates an access token for the user

`POST /favorites`
```
{
  "token": "someToken",
  "courseId": 111
}
```

  - favorites a course
