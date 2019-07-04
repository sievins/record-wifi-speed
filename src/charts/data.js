const { readFileSync } = require('fs')
const { map } = require('ramda')
const { recordsLocation } = require('../util')

const parse = (file) => JSON.parse(readFileSync(file).toString())
const records = parse(recordsLocation)

const mapRecord = (type) => map((record) => record[type], records)
const downloads = mapRecord('download')
const uploads = mapRecord('upload')
const pings = mapRecord('ping')

module.exports = {
  downloads,
  uploads,
  pings,
}
