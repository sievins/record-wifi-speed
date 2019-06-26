const path = require('path')
const shell = require('shelljs')
const moment = require('moment')
const wifiName = require('wifi-name')
require('dotenv').config()

const { exec, ShellString } = shell

wifiName().then(name => {
  if (name === process.env.WIFI_NAME) {
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
  ShellString(output).toEnd(process.env.RECORD_LOCATION)
}
