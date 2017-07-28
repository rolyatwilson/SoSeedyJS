const yaml = require('js-yaml')
const fs = require('fs')

const config = yaml.safeLoad(fs.readFileSync('./config.yml'))
export const CANVAS_DOMAIN = config['canvasDomain']
export const DEVELOPER_KEY = config['developerKey']
export const ACCOUNT_ADMIN = config['accountAdmin']
export const RANDOM_COURSE_NAMES = config['course']['names']
