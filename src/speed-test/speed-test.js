const speedTestNet = require('speedtest-net')
const currentWifiName = require('wifi-name')
const moment = require('moment')
const writeRecord = require('./write-record')

module.exports = ({ wifiName, resultsDirectory }) => {
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

      writeRecord(resultsDirectory, record)
    })

    test.on('error', error => {
      console.error(`Failed to get the results of the speed test\n${error}`)
    })
  }
}
