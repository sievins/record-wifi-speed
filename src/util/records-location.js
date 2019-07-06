const { resolve } = require('path')
const { environmentVariable } = require('./environment-variable')

module.exports = resolve(environmentVariable('resultsDirectory'), './records.txt')
