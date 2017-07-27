const yaml = require('js-yaml')
const fs = require('fs')

const config = yaml.safeLoad(fs.readFileSync('./config.yml'))
const indendentJson = JSON.stringify(config, null, 2)

console.log(indendentJson)