const { resolve } = require('path')
const environmentVariable = require('./environmentVariable')

module.exports = resolve(environmentVariable('resultsDirectory'), './records.txt')
