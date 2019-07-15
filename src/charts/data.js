const { readFileSync } = require('fs')
const { map } = require('ramda')
const { logger, recordsLocation } = require('../util')

try {
  const records = JSON.parse(readFileSync(recordsLocation).toString())

  const mapRecord = (type) => map((record) => record[type], records)
  const downloads = mapRecord('download')
  const uploads = mapRecord('upload')
  const pings = mapRecord('ping')

  module.exports = {
    downloads,
    uploads,
    pings,
  }
} catch (error) {
  logger.error(`Could not parse ${recordsLocation}. Does ${recordsLocation} exists and does it contain record data?\n${error}`)
}
