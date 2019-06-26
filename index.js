const path = require('path')
const shell = require('shelljs')
const moment = require('moment')
const currentWifiName = require('wifi-name')

const { exec, ShellString } = shell

module.exports = ({ wifiName, recordLocation }) => {
  currentWifiName().then(name => {
    if (name === wifiName) {
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
    ShellString(output).toEnd(recordLocation)
  }
}
