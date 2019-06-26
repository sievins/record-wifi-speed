const path = require('path')
const shell = require('shelljs')
const moment = require('moment')
const wifiName = require('wifi-name')
require('dotenv').config()

const { exec, ShellString } = shell

// When running as an executable these variables are provided as args
const WIFI_NAME = process.argv[2] || process.env.WIFI_NAME
const RECORD_LOCATION = process.argv[3] || process.env.RECORD_LOCATION

wifiName().then(name => {
  if (name === WIFI_NAME) {
    speedTest()
  }
})

const speedTest = () => {
  // pkg knows to include speed-test as an asset by parsing path.join
  const speedTestPath = path.join(__dirname, 'node_modules/speed-test/cli.js')
  const speedTestCommand = `node ${speedTestPath} -j`

  exec(speedTestCommand, (code, stdout) => {
    const result = JSON.parse(stdout)

    const now = moment()
    const day = now.format('DD/MM/YYYY')
    const time = now.format('HH:mm')

    const record = {
      ...result,
      day,
      time,
    }

    writeRecord(record)
  })
}

const writeRecord = (record) => {
  const output = `${JSON.stringify(record)}\n`
  ShellString(output).toEnd(RECORD_LOCATION)
}
