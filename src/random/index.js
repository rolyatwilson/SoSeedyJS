const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const uuidv4 = require('uuid/v4')
const rs = require('random-strings')

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../public/faker/faker.yml')))

export const COURSE_TYPES = config['educator']['tertiary']['course']['type']
export const COURSE_SUBJECTS = config['educator']['tertiary']['course']['subject']

export const FIRST_NAMES = config['name']['first_name']
export const LAST_NAMES = config['name']['last_name']

export function random(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function courseName() {
  return `${random(COURSE_TYPES)} ${random(COURSE_SUBJECTS)}`
}

export function userName() {
  return `${random(FIRST_NAMES)} ${random(LAST_NAMES)}`
}

export function userLoginId() {
  return `${new Date().getTime()}@${uuidv4()}.com`
}

export function userPassword() {
  // user rs.hex(...) in the future
  return 'password'
}