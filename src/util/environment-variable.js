require('dotenv').config()
const { complement, equals, findLast, head, split } = require('ramda')

const doesNotEqual = complement(equals)

const entryPoint = (filename) => {
  const parts = split(/[\/\\]/, filename)
  const entryFile = findLast(doesNotEqual('index.js'), parts)
  return head(split('.', entryFile))
}

const arg = (number) => process.argv[(number + 1)]
const env = (variable) => process.env[variable]

const entryMap = {
  'run-speed-test': {
    wifiName: arg(1) || env('WIFI_NAME'),
    resultsDirectory: arg(2) || env('RESULTS_DIRECTORY'),
  },
  'run-generate-charts': {
    resultsDirectory: arg(1) || env('RESULTS_DIRECTORY'),
  },
}

const environmentVariable = (name) => entryMap[entryPoint(require.main.filename)][name]

module.exports = {
  environmentVariable,
  entryPoint,
  entryMap,
}
