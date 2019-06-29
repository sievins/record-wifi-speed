const shell = require('shelljs')
const moment = require('moment')
const currentWifiName = require('wifi-name')
const speedTestNet = require('speedtest-net')

const { ShellString, mkdir } = shell

module.exports = ({ wifiName, recordLocation }) => {
  currentWifiName().then(name => {
    if (name === wifiName) {
      speedTest()
    }
  })

  const speedTest = () => {
    const test = speedTestNet({maxTime: 5000})

    test.on('data', data => {
      const now = moment()
      const day = now.format('DD/MM/YYYY')
      const time = now.format('HH:mm')

      const record = {
        ping: data.server.ping,
        download: data.speeds.download,
        upload: data.speeds.upload,
        day,
        time,
      }

      writeRecord(record)
    })

    test.on('error', error => {
      console.error(`Failed to get the results of the speed test\n${error}`)
    })
  }

  const writeRecord = (record) => {
    const output = `${JSON.stringify(record)}\n`

    // If the recordLocation doesn't already exist, create it's directory
    mkdir('-p', `${recordLocation}/..`)

    ShellString(output).toEnd(recordLocation)
  }
}
