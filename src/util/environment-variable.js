require('dotenv').config()
const { complement, equals, findIndex, findLast, head, split } = require('ramda')

const doesNotEqual = complement(equals)

const entryPoint = (filename) => {
  const parts = split(/[/\\]/, filename)
  const entryFile = findLast(doesNotEqual('index.js'), parts)
  return head(split('.', entryFile))
}

const env = (variable) => process.env[variable]
const arg = (number) => process.argv[(number + 1)]
const optionalArg = (option) => {
  const { argv } = process
  const index = findIndex(equals(option), argv)
  const found = index !== -1
  return found ? arg(index) : undefined
}

const entryMap = {
  'run-speed-test': {
    wifiName: arg(1) || env('WIFI_NAME'),
    resultsDirectory: arg(2) || env('RESULTS_DIRECTORY'),
  },
  'run-generate-charts': {
    resultsDirectory: arg(1) || env('RESULTS_DIRECTORY'),
    numberOfGroups: optionalArg('--number-of-groups') || env('NUMBER_OF_GROUPS'),
  },
}

const environmentVariable = (name) => entryMap[entryPoint(require.main.filename)][name]

module.exports = {
  entryMap,
  entryPoint,
  environmentVariable,
}
