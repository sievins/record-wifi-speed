const test = require('tape-catch')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const { includes } = require('ramda')

const wifiName = 'PLUSNET-1234'
const incorrectWifiName = 'PUBLIC_WIFI'
const resultsDirectory = '/path/to/results/directory'
const errorMessage = 'stack trace'
const day = '01/01/1970'
const time = '12:00'
const ping = 1
const download = 2
const upload = 3

const sandbox = sinon.createSandbox()
const writeRecord = sandbox.spy()
const onSpeedTestNet = sandbox.spy()
const errorLogger = sandbox.spy()
const format = sandbox.stub()
format.withArgs('DD/MM/YYYY').returns(day)
format.withArgs('HH:mm').returns(time)

let clock
const setup = () => {
  clock = sinon.useFakeTimers()
}
const teardown = () => {
  clock.restore()
  sandbox.restore()
}

const requireSpeedTestNet = (resultType) => {
  const callbacks = {}
  return function () {
    onSpeedTestNet()

    const subscriber = {
      on: (key, callback) => {
        callbacks[key] = callback
      },
    }

    setTimeout(() => {
      const callbackArg =
        resultType === 'data' ? { server: { ping }, speeds: { download, upload } } :
        resultType === 'error' ? errorMessage : null

      callbacks[resultType](callbackArg)
    }, 10)

    return subscriber
  }
}

const requireSpeedTest = (speedTestNet) => (
  proxyquire('./speed-test', {
    'speedtest-net': speedTestNet,
    'wifi-name': () => Promise.resolve(wifiName),
    'moment': () => ({ format }),
    './write-record': writeRecord,
    '../util': { logger: { error: errorLogger } },
  })
)

test('do not run a speed test if the wifi network isn\'t correct', (t) => {
  setup()
  const speedTest = requireSpeedTest(requireSpeedTestNet('data'))

  speedTest({ wifiName: incorrectWifiName, resultsDirectory }).then(() => {
    t.ok(onSpeedTestNet.notCalled)

    teardown()
    t.end()
  })
})

test('runs a speed test if the wifi network is correct', (t) => {
  setup()
  const speedTest = requireSpeedTest(requireSpeedTestNet('data'))

  speedTest({ wifiName, resultsDirectory }).then(() => {
    t.ok(onSpeedTestNet.called)

    teardown()
    t.end()
  })
})

test('write record to the results directory', (t) => {
  setup()
  const speedTest = requireSpeedTest(requireSpeedTestNet('data'))

  speedTest({ wifiName, resultsDirectory }).then(() => {
    clock.tick(20)

    t.ok(writeRecord.calledWith(resultsDirectory))

    teardown()
    t.end()
  })
})

test('write record with correct props', (t) => {
  setup()
  const speedTest = requireSpeedTest(requireSpeedTestNet('data'))

  speedTest({ wifiName, resultsDirectory }).then(() => {
    clock.tick(20)

    t.ok(writeRecord.calledWith(resultsDirectory, { ping, download, upload, day, time }))

    teardown()
    t.end()
  })
})

test('log error if speed test fails', (t) => {
  setup()
  const speedTest = requireSpeedTest(requireSpeedTestNet('error'))

  speedTest({ wifiName, resultsDirectory }).then(() => {
    clock.tick(20)

    const loggedMessage = errorLogger.args[0][0]
    t.ok(includes(errorMessage, loggedMessage))

    teardown()
    t.end()
  })
})
