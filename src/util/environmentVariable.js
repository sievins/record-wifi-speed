require('dotenv').config()
const { complement, equals, findLast, head, split } = require('ramda')

const doesNotEqual = complement(equals)

const entryPoint = () => {
  const filename = require.main.filename
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

module.exports = (name) => entryMap[entryPoint()][name]
