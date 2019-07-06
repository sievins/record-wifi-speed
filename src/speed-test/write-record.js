const { mkdirSync, readFileSync, writeFileSync } = require('fs')
const { replace } = require('ramda')
const { recordsLocation } = require('../util')

module.exports = (resultsDirectory, record) => {
  try {
    const buffer = readFileSync(recordsLocation)
    const oldRecords = buffer.toString()
    const isFileEmpty = oldRecords === ''
    const newRecord = isFileEmpty ?
      `[${JSON.stringify(record)}]\n` :
      replace(/]/, `,\n${JSON.stringify(record)}]`, oldRecords)
    writeFileSync(recordsLocation, newRecord)
  } catch (e) {
    mkdirSync(resultsDirectory, { recursive: true })
    writeFileSync(recordsLocation, `[${JSON.stringify(record)}]\n`)
  }
}
